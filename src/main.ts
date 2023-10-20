import { exec } from 'child_process'
import * as fs from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import * as http from 'node:http'
import { isMainThread, parentPort } from 'worker_threads'
import { ServerConfig } from '../types/index'
import { includeCommand, initCommand, parseCommand, parseCommandArgs, parseHelpCommand } from './command/index'
import { CACHE_COMMAND_KEY } from './constant'
import handlerMiddware from './middware/index'
import { getExt, unknownFile } from './render/files'
import logo from "./render/logo"
import Page, { LRUCache } from './render/page'
import { NotFound } from "./render/template"
import {
    colorUtils,
    createIndexHtml,
    curReadFolder,
    errorLog,
    getAbsoluteUrl,
    isAllowResolve,
    isMac,
    isWindow,
    readFile
} from './utils/utils'
import { childWorkerRun, watchContent } from "./watch/index"




// 所有请求
const allReqUrl = []
// 最大请求容量
const MAX_PAGE_SIZE = 100
// 缓存错误页面
const NotFoundPageUrl = []
// 缓存加载过程中的页面
const pageCache = new LRUCache(MAX_PAGE_SIZE)
// 默认错误页
const NOT_FOUND_PAGE = new Page("404.html", NotFound, true)

const hostname = '127.0.0.1'

let count = 0
/* command args */

export let serverConfig: ServerConfig | null = null


/**
 * blog
 */
export let defaultMyContent = 'https://wuxin0011.github.io/tools/node-live-serve/'



const cors = (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('Access-Control-Allow-Origin', '*')
}



/**
 * 启动入口
 */
const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
    cors(request, response)
    handlerMiddware(request, response)
    let url = request.url
    // 是否是错误请求
    if (NotFoundPageUrl.indexOf(url) !== -1) {
        colorUtils.error(`访问路径不存在！:${url} 对应真实文件路径： ${getAbsoluteUrl(url, serverConfig.root)}`)
        responseTemplate(request, response, NOT_FOUND_PAGE)
        return;
    }
    // 是否是允许的请求
    if (isAllowResolve(url)) {
        // 请求是否存在以及是否缓存了如果请求没有缓存走该请求
        if (allReqUrl.indexOf(url) === -1) {
            responseContent(request, response)
            return;
        }
        // 响应处理
        const cacheContent = pageCache.get(url)
        if (cacheContent === -1) {
            responseContent(request, response)
            return;
        }
        responseContent(request, response)
        // responseTemplate(request, response, (cacheContent ?? NOT_FOUND_PAGE) as Page)
    }
})


/**
 * 请求的文件
 * @param {*} request 请求
 * @param {*} response 响应
 */
const responseContent = (request: IncomingMessage, response: ServerResponse) => {
    let url = request.url
    let real_url = getAbsoluteUrl(url, serverConfig.root);
    // colorUtils.warning(`${new Date().toLocaleString()} 请求地址 = http://${hostname}:${port}${url} 真实路径 = ${real_url} `)
    // 检查文件是否存在
    if (!fs.existsSync(real_url)) {
        if (!serverConfig.single) {
            responseErrorPage(request, response, "请求内容不存在")
        }
        // 不存在的路径缓存
        NotFoundPageUrl.push(url)
        return;
    }
    try {

        // 获取对应路径文件的状态信息
        const status = fs.statSync(real_url)
        if (getExt(url) === unknownFile) {
            if (status.isDirectory() && (serverConfig.parseIndex) || serverConfig.single) {
                const indexHtml = createIndexHtml(real_url, serverConfig)
                if (fs.existsSync(indexHtml)) {
                    let content = readFile(indexHtml)
                    // 响应页面内容
                    const this_page = new Page(url, content, false)
                    responseTemplate(request, response, this_page)
                    // 缓存本次 请求
                    allReqUrl.push(url)
                    pageCache.set(url, this_page)
                }
            }
            return;
        }


        // 如果是文件夹类型文件 应该直接读取第一级文件的文件信息 响应一个页面
        if (status.isDirectory()) {
            curReadFolder(real_url, pageCache.cache)
            const page = pageCache.get(url)
            responseTemplate(request, response, page !== -1 ? page as Page : NOT_FOUND_PAGE)
        } else {

            // 非目录文件 读取文件内容
            const content = readFile(real_url)
            if (!content) {
                if (!serverConfig.single) {
                    responseErrorPage(request, response, "请求内容不存在")
                    // 缓存本次请求
                    NotFoundPageUrl.push(url)
                }

            } else {
                // 响应页面内容
                const page = new Page(url, content, false)
                pageCache.set(url, page)
                // 缓存本次 请求
                allReqUrl.push(url)
                responseTemplate(request, response, page)
            }
        }
    } catch (error) {
        colorUtils.error(`响应失败：${error}`)
        responseErrorPage(request, response, error)
        return;
    }
}

/**
 * 响应一个异常请求的页面
 * @param {*} request request
 * @param {*} response  response
 * @param {*} message 错误详情
 * @param {*} template 指定错误模板
 * @param {*} url 错误连接，默认是 请求地址
 */
const responseErrorPage = (request: IncomingMessage, response: ServerResponse, message: string, template?: string, url?: string) => {
    let errorContent = null
    url = url ?? request.url
    template = template ?? NotFound
    if (message) {
        errorContent = template.replace(/<h2>(.*?)<\/h2>/, `<h2 style="color:red;">${message.toString()}<\/h2>`)
    }
    responseTemplate(request, response, new Page(url, message && errorContent ? errorContent : 'error', true))
}


/**
 * 响应内容
 * @param {*} request 请求
 * @param {*} response 响应
 * @param {*} page page类的对象
 */
const responseTemplate = (request: IncomingMessage, response: ServerResponse, page: Page) => {
    try {
        // colorUtils.success('内容响应中...', page.pageUrl)
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Content-Type', serverConfig.single && (page.pageUrl === '/' || page.pageUrl === '') ? 'text/html;charset=utf-8' : page.contentType);
        // !!! todo 如果直接使用内容长短不知道为什么报错 容易确实文件
        // response.setHeader('Content-length', page.content.length);
        response.write(page.content);
        response.end();
    } catch (error) {
        // ignore ...
        colorUtils.error(`response error:${error}`)
    }
}


const openWebPage = (url: string) => {
    let runCommand = ''
    let isInitSystemCommand = false
    if (!isInitSystemCommand) {
        if (isWindow()) {
            runCommand = 'start'
            isInitSystemCommand = true
        } else if (isMac()) {
            runCommand = 'open'
            isInitSystemCommand = true
        } else {
            isInitSystemCommand = false
        }
    }

    if (isInitSystemCommand) {
        exec(`${runCommand} ${url}`, (error, stdout, stderr) => {
            if (error) {
                colorUtils.error(`浏览器打开失败！错误详情: ${error}`)
                errorLog(error)
                return;
            }
            if (stderr) {
                colorUtils.error(`浏览器打开失败！错误详情: ${stderr}`)
                errorLog(error)
                return;
            }
            if (stdout) {
                // ...
            }
        })
    } else {
        colorUtils.warning('当前环境不支持打开默认浏览器 请手动打开！')
    }

    if (serverConfig.logo) {
        colorUtils.success(logo)
    }

    colorUtils.success(`live-server 启动成功！点击访问 ${url}`)
}


const saveConfig = (config: ServerConfig, cache: LRUCache) => {
    if (!config) {
        throw new Error('config init error !')
    }
    cache.set(CACHE_COMMAND_KEY, config)
}


export const run = () => {
    let firstStart = true
    const start = (error: unknown) => {
        if (count < 20) {
            if (!firstStart) {
                serverConfig.port += 1
                count += 1
            }
            try {
                server.listen({
                    host: hostname,
                    port: serverConfig.port
                }, () => {
                    curReadFolder(getAbsoluteUrl('', serverConfig.root), pageCache.cache, false)
                    if (serverConfig.open) {
                        openWebPage(`http://${hostname}:${serverConfig.port}`)
                    }
                    if (serverConfig.watch) {
                        childWorkerRun(serverConfig, serverConfig.time, pageCache)
                    }
                    firstStart = false
                })
                server.on('error', (error) => {
                    // colorUtils.error(error)
                    firstStart = false
                    start(error)
                })
            } catch (error) {
                // colorUtils.error(error)
                firstStart = false
                start(error)
            }
        } else {
            colorUtils.error('启动失败:', error)
            server.close()
            errorLog(error)
        }

    }

    try {
        if (includeCommand('--help') || includeCommand('help')) {
            parseHelpCommand()
        } else if (includeCommand(initCommand.open)) {
            const url = parseCommandArgs(initCommand.open, defaultMyContent) as string
            openWebPage(url)
        } else {
            serverConfig = parseCommand()
            saveConfig(serverConfig, pageCache)
            start(null)
        }
    } catch (e) {
        colorUtils.error(`启动失败：${e}`)
    }

}


const bootStrap = () => {
    if (isMainThread) {
        run()
    } else {
        parentPort.on('message', message => {
            watchContent(message)
        });
    }

}

export default bootStrap



