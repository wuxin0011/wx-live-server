import * as fs from 'node:fs'
import * as path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { getClassName } from '../render/files'
import Page from '../render/page'
import { Template } from "../render/template"
import { CustomColor, Index } from '../color/index'
import { indexHtml, isParseIndexHtml, isSingle, rootFolder } from "../main";
import { Command } from "../command/index";
import { CACHE_COMMAND_KEY } from '../watch/index'

/**
 * is windows ?
 */
export const isWindow = () => process.platform === 'win32'

/**
 * is mac ?
 */
export const isMac = () => process.platform === 'darwin'


export const createIndexHtml = (p: string, isParseIndexHtml: boolean = false, isSingle: boolean = false, indexName: string = indexHtml) => {
    return `${p}\\${indexHtml}`
}


/**
 * 生成渲染之后内容
 * @param url 文件路径
 * @param isFolder 是否是文件夹
 * @returns
 */
export const getTagStr = (url: string, isFolder = false) => {
    const fileName = path.basename(url)
    if (isFolder) {
        return `<a class="folder" href="${url}">${fileName}</a>`
    } else {
        return `<a class="file ${getClassName(url)}" href="${url}" >${fileName}</a>`
    }

}

/**
 * 转义符号
 * @param folderPath
 * @returns
 */
export const getRequestUrl = (folderPath: string) => ("/" + folderPath.split(__dirname)[1].replace(/\\\\/ig, "/")).replace(/\\/ig, "/").replace(/\/\/\//g, "/").replace(/\/\//g, "/")


/**
 * 读取文件内容
 * @param p 文件路径
 * @param mode 模式
 * @returns buffer
 */
export const readFile = (p: string, mode = 'utf-8') => {
    try {
        return fs.readFileSync(p)
    } catch (e) {
        errorLog(e)
        return ''
    }
}

/**
 * 错误日志
 * @param msg 错误消息内容
 * @param log 日志文件名
 */
export const errorLog = (msg: any, log = "error.log",) => {
    msg = `\n=================${new Date()}==============\n ${msg} \n==============================================================================`
    fs.appendFile(path.join(__dirname, log), msg, (err) => {
        if (err) {
            console.warn('日志写入失败！', err)
        }
    })
}

// 暂时不处理ico格式文件
// 在此处可以错拦截请求管理
export const isAllowResolve = (url: string) => {
    // console.log('url:=>',url,!/\.ico$/.test(url) && !(/http[s]:\/\//.test(url)))
    return !/\.ico$/.test(url) && !(/http[s]:\/\//.test(url))
}


export const getAbsoluteUrl = (url: string) => {
    return path.join(__dirname, rootFolder, url == '' ? '' : decodeURIComponent(handlerUrl(url)))
}


export const handlerUrl = (url: string) => {
    if (!url) {
        return ''
    }
    if (url.indexOf('?') !== -1) {
        url = url.split('?')[0]
    }
    return url
}


/**
 *
 * @param folderPath 文件夹路径
 * @param cache 缓存内容
 * @param isParse 是否已经是解析之后的路径了
 * @param r 缓存路径
 * @returns
 */
export const curReadFolder = (
    folderPath: string = __dirname,
    cache: Map<string, Page | Command>,
    isParse: boolean = false,
) => {
    let thisCommand = cache.get(CACHE_COMMAND_KEY) as Command
    let temp = ''
    // 读取当前文件夹下所有文件
    const p = isParse ? folderPath : path.join(folderPath, thisCommand.root)
    let reqUrl = folderPath === __dirname ? '/' : decodeURIComponent(getRequestUrl(folderPath))
    let readContent: string | Buffer = ''
    if (thisCommand.single) {
        // is single web page ?
        const i = createIndexHtml(path.join(__dirname, thisCommand.root), false, true)
        if (fs.existsSync(i)) {
            readContent = fs.readFileSync(i)
        }
    } else if (thisCommand.isParseIndex) {
        // check index.html is exists
        const i = createIndexHtml(p)
        if (fs.existsSync(i)) {
            readContent = fs.readFileSync(i)
        }
    } else {
        const files = fs.readdirSync(folderPath)
        for (let i = 0; i < files.length; i++) {
            let fileName = files[i]
            const filePath = path.join(__dirname, thisCommand.root, fileName);
            try {
                let this_url = getRequestUrl(filePath)
                let isDirectory = fs.statSync(filePath).isDirectory()
                temp += getTagStr(this_url, isDirectory)
            } catch (error) {
                errorLog(error)
            }
        }
        let title = path.basename(reqUrl) === '/' || path.basename(reqUrl) === '' ? '首页' : path.basename(reqUrl)
        readContent = Template.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`).replace(/<div class="container">(.*?)<\/div>/, `<div class="container">${temp}</div>`)
    }
    cache.set(reqUrl, new Page(reqUrl, readContent, true))
    return readContent
}


export const colorUtils = {
    'success': function (...args: any[]) {
        console.log(CustomColor.fontColor(66, 211, 146, args))
    },
    'background': function (R: number, G: number, L: number, ...args: any[]) {
        console.log(CustomColor.fontColor(66, 211, 146, args))
    },
    'custom': function (background: Index, fontColor: Index, ...args: any[]) {
        console.log(CustomColor.backgroundAndFontColor(background.R, background.G, background.L, fontColor.R, fontColor.G, fontColor.L, args))
    }
}


