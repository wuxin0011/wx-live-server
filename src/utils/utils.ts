import * as fs from 'node:fs'
import * as path from 'node:path'
import { ServerConfig } from '../../types/index'
import { CustomColor, Index } from '../color/index'
import { getClassName } from '../render/files'
import Page from '../render/page'
import { Template } from "../render/template"
import { CACHE_COMMAND_KEY } from '../watch/index'

/**
 * is windows ?
 */
export const isWindow = () => process.platform === 'win32'

/**
 * is mac ?
 */
export const isMac = () => process.platform === 'darwin'


export const createIndexHtml = (p: string, config?: ServerConfig) => {
    if (config.single) {
        return path.join(getAbsoutePath(config.root), config.index)
    }
    if (p.indexOf(getAbsoluteUrl(config!.root)) !== -1) {
        return path.join(p, config.index)
    } else {
        return path.join(getAbsoutePath(config.root), p, config.index)
    }
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
export const getRequestUrl = (folderPath: string, rootDir: string) => {
    return ("/" + folderPath.split(getAbsoutePath(rootDir))[1].replace(/\\\\/ig, "/"))
        .replace(/\\/ig, "/").replace(/\/\/\//g, "/").replace(/\/\//g, "/")
}


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
    return !/\.ico$/.test(url) && !(/^http[s]:\/\//.test(url))
}


export const getAbsoluteUrl = (url: string, rootDir: string = './') => {
    const abs = getAbsoutePath(rootDir)
    if (!url) {
        return abs
    }
    url = decodeURIComponent(handlerUrl(url))
    if (url.indexOf(abs) !== -1) {
        return url.indexOf(abs) !== -1 ? url : path.join(abs, url)
    } else {
        return path.join(abs, url == '' ? '' : url)
    }
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


export const getAbsoutePath = (rootDir: string) => {
    if (rootDir.startsWith('/')) {
        return rootDir
    }
    if (/^.:/.test(rootDir)) {
        return rootDir
    }
    return rootDir.indexOf(path.join(__dirname, rootDir)) !== -1 ? rootDir : path.join(__dirname, rootDir)
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
    folderPath: string = getAbsoutePath(''),
    cache: Map<string, Page | ServerConfig>,
    isParse: boolean = false,
) => {
    // console.log('response dictory:', folderPath)
    let config = cache.get(CACHE_COMMAND_KEY) as ServerConfig
    let temp = ''
    // 读取当前文件夹下所有文件
    const p = isParse ? folderPath : getAbsoluteUrl(folderPath, config.root)
    let reqUrl = folderPath === getAbsoluteUrl(config.root) ? '/' : decodeURIComponent(getRequestUrl(folderPath, config.root))
    let readContent: string | Buffer = ''
    if (config.single) {
        // is single web page ?
        const i = createIndexHtml(getAbsoutePath(config.root), config)
        if (fs.existsSync(i)) {
            readContent = fs.readFileSync(i)
        } else {
            colorUtils.error(`place check ${config.index} exist ?`)
        }
    } else if (config.parseIndex && fs.existsSync(createIndexHtml(p))) {
        // check index.html is exists
        readContent = fs.readFileSync(createIndexHtml(p))
    } else {
        // 这种情况就是指定打开默认 index.html 但是 默认路径中 index.html 文件不存在！
        // 或者index 解析为false
        const files = fs.readdirSync(folderPath)
        for (let i = 0; i < files.length; i++) {
            try {
                const file = getAbsoluteUrl(files[i], config.root);
                let this_url = getRequestUrl(file, config.root)
                let isDirectory = fs.statSync(file).isDirectory()
                temp += getTagStr(this_url, isDirectory)
            } catch (error) {
                colorUtils.error(`curReadFolder  error: ${error}`)
                errorLog(error)
            }
        }
        let title = path.basename(reqUrl) === '/' || path.basename(reqUrl) === '' ? '首页' : path.basename(reqUrl)
        readContent = Template
            .replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
            .replace(/<div class="container">(.*?)<\/div>/, `<div class="container">${temp}</div>`)


    }
    console.log('save url : ', reqUrl, 'content:', readContent.toString())
    cache.set(reqUrl, new Page(reqUrl, readContent, true))
    return readContent
}


export const colorUtils = {
    'success': function (...args: any[]) {
        console.log(CustomColor.fontColor(66, 211, 146, args))
    },
    'error': function (...args: any[]) {
        console.log(CustomColor.fontColor(247, 78, 30, args))
    },
    'warning': function (...args: any[]) {
        console.log(CustomColor.fontColor(255, 185, 0, args))
    },
    'background': function (R: number, G: number, L: number, ...args: any[]) {
        console.log(CustomColor.fontColor(66, 211, 146, args))
    },
    'custom': function (background: Index, fontColor: Index, ...args: any[]) {
        console.log(CustomColor.backgroundAndFontColor(background.R, background.G, background.L, fontColor.R, fontColor.G, fontColor.L, args))
    }
}


