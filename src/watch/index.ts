import Page, { LRUCache } from "../render/page";
import { parentPort, Worker } from "worker_threads";
import * as  path from "node:path";
import * as fs from "node:fs";
import { curReadFolder, errorLog, getAbsoluteUrl, readFile } from "../utils/utils";
import { Command } from "../command/index";
import { refreshTime } from "../main";

export const CACHE_COMMAND_KEY = 'CACHE_COMMAND_KEY'

let childWorkCommand: Command | null = null

/**
 * watch content
 * @param message 消息
 * @param pageCache 缓存
 */
export const cacheUpdate = (message: any, pageCache: LRUCache) => {
    if (message instanceof Map) {
        for (let [k, v] of message.entries()) {
            if (k && k !== CACHE_COMMAND_KEY && v) {
                pageCache.set(k, v)
            }
        }
    }
}
let commandIsLoad = false

/**
 * 监听文件是否修改
 * @param message
 */
export const watchContent = (message: unknown) => {
    if (message instanceof Map) {
        for (let [k, v] of message.entries()) {
            if (k === CACHE_COMMAND_KEY && !commandIsLoad) {
                childWorkCommand = message.get(CACHE_COMMAND_KEY) as Command
                commandIsLoad = true
            } else if (commandIsLoad) {
                watchFileChange(v, message)
            }
        }
        // 通知主线程修改cache
        parentPort.postMessage(message);
    }

}

const FileNotFounds = []


export const watchFileChange = (page: Page, cache: Map<string, Page | Command>) => {
    if (!childWorkCommand) {
        return;
    }
    if (!(cache instanceof Map)) {
        return;
    }
    if (!page?.pageUrl || !page?.content || !page?.contentType) {
        return;
    }
    let pageUrl = page.pageUrl
    // file is must find not !
    if (FileNotFounds.indexOf(pageUrl) !== -1) {
        return;
    }
    let real_url = path.join(__dirname, childWorkCommand.root, pageUrl);
    console.log('watch url =', real_url)

    if (!fs.existsSync(real_url)) {
        FileNotFounds.push(pageUrl)
        return;
    }
    const status = fs.statSync(real_url)
    if (status.isDirectory()) {
        curReadFolder(real_url, cache, true)
    } else {
        try {
            const data = readFile(real_url)
            // if (data.toString() !== page.content.toString()) {
            //     cache.set(pageUrl, new Page(pageUrl, data))
            // }
            if (data) {
                cache.set(pageUrl, new Page(pageUrl, data))
            }
        } catch (error) {
            errorLog(error)
        }

    }


}


export const childWorkerRun = (cmd: Command, time: number = refreshTime, pageCache: LRUCache) => {
    const childWorker = new Worker(__filename);
    setInterval(() => {
        childWorker.postMessage(pageCache);
    }, time);
    childWorker.on('message', message => {
        cacheUpdate(message, pageCache)
    });
}
