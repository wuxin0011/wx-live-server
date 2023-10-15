import { exec } from 'child_process'
import * as fs from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import * as http from 'node:http'
import { isMainThread, parentPort } from 'worker_threads'
import {
    Command,
    helpCommand,
    includeCommand,
    openUrlCommand,
    parseCommand,
    parseCommandArgs,
    parseHelpCommand
} from "./command/index"
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
    handlerUrl,
    isAllowResolve,
    isMac,
    isWindow,
    readFile
} from './utils/utils'
import { CACHE_COMMAND_KEY, childWorkerRun, watchContent } from "./watch/index"




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

/**
 * 是否直接解析访问路径的 指定文件 默认index.html
 */
export let isParseIndexHtml = false


export let indexHtml = 'index.html'

/**
 * 监听时间
 */
export let refreshTime = 3000

/**
 * 指定启动的跟根路径
 */
export let rootFolder = '.'

/**
 * 指定启动默认端口号
 */
export let port = 8080


/**
 * watch
 */
export let isWatch = false


/**
 * watch
 */
export let isSingle = false

/**
 * 默认是否打开网页
 */
export let isOpen = true


/**
 * 是否输出Logo 默认输出
 */
export let isPrintLogo = true


let command: Command | null | undefined = null


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
    let url = decodeURIComponent(handlerUrl(request.url))
    // 是否是错误请求
    if (NotFoundPageUrl.indexOf(url) !== -1) {
        responseTemplate(request, response, NOT_FOUND_PAGE)
        return;
    }
    // 是否是允许的请求
    if (isAllowResolve(url)) {
        // 请求是否存在以及是否缓存了如果请求没有缓存走该请求
        // if (allReqUrl.indexOf(url) === -1) {
        //     responseContent(request, response)
        //     return;
        // }
        // // 响应处理
        // const cacheContent = pageCache.get(url)
        // if (cacheContent === -1) {
        //     responseContent(request, response)
        //     return;
        // }
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
    let url = handlerUrl(request.url)
    let real_url = getAbsoluteUrl(url, command.root);
    let requestUrl = decodeURIComponent(url)
    colorUtils.warning(`access = http://${hostname}:${port}${url} path = ${real_url} `)
    // 检查文件是否存在
    if (!fs.existsSync(real_url)) {
        if (!command.single) {
            responseErrorPage(request, response, "请求内容不存在")
        }
        return;
    }
    try {

        const status = fs.statSync(real_url)
        if (getExt(url) === unknownFile) {
            if (status.isDirectory() && (isParseIndexHtml) || isSingle) {
                const indexHtml = createIndexHtml(real_url, command)
                if (fs.existsSync(indexHtml)) {
                    let content = readFile(indexHtml)
                    // 响应页面内容
                    const this_page = new Page(requestUrl, content, false)
                    responseTemplate(request, response, this_page)
                    // 缓存本次 请求
                    allReqUrl.push(requestUrl)
                    pageCache.set(requestUrl, this_page)
                }
            }
            return;
        }
        if (status.isDirectory()) {
            curReadFolder(real_url, pageCache.cache)
            const page = pageCache.get(requestUrl)
            responseTemplate(request, response, page !== -1 ? page as Page : NOT_FOUND_PAGE)
        } else {
            const content = readFile(real_url)
            if (!content) {
                if (!command.single) {
                    responseErrorPage(request, response, "请求内容不存在")
                    // 缓存本次请求
                    NotFoundPageUrl.push(requestUrl)
                }

            } else {
                // 响应页面内容
                const page = new Page(requestUrl, content, false)
                pageCache.set(requestUrl, page)
                // 缓存本次 请求
                allReqUrl.push(requestUrl)
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
        colorUtils.success('内容响应中...', page.pageUrl)
        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Content-Type', command.single && (page.pageUrl === '/' || page.pageUrl === '') ? 'text/html;charset=utf-8' : page.contentType);
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
    let command = ''
    let isInitSystemCommand = false
    if (!isInitSystemCommand) {
        if (isWindow()) {
            command = 'start'
            isInitSystemCommand = true
        } else if (isMac()) {
            command = 'open'
            isInitSystemCommand = true
        } else {
            isInitSystemCommand = false
        }
    }

    if (isInitSystemCommand) {
        exec(`${command} ${url}`, (error, stdout, stderr) => {
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

    if (isPrintLogo) {
        colorUtils.success(logo)
    }

    colorUtils.success(`live-server 启动成功！点击访问 ${url}`)
}


const initCommandArgs = (command: Command, cache: LRUCache) => {
    if (!command) {
        throw new Error('commannd init error !')
    }
    port = command.port
    indexHtml = command.index
    isParseIndexHtml = command.isParseIndex
    rootFolder = command.root
    isSingle = command.single
    isOpen = command.open
    refreshTime = command.time
    isWatch = command.watch
    isPrintLogo = command.logo
    cache.set(CACHE_COMMAND_KEY, command)
}


export const run = () => {
    let firstStart = true
    const start = (error: unknown) => {
        if (count < 20) {
            if (!firstStart) {
                port += 1
                count += 1
            }
            try {
                server.listen({
                    host: hostname,
                    port: port
                }, () => {
                    curReadFolder(getAbsoluteUrl('', command.root), pageCache.cache, false)
                    if (isOpen) {
                        openWebPage(`http://${hostname}:${port}`)
                    }
                    if (isWatch) {
                        childWorkerRun(command, refreshTime, pageCache)
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
        if (includeCommand(helpCommand) || includeCommand('help')) {
            parseHelpCommand()
        } else if (includeCommand(openUrlCommand)) {
            const url = parseCommandArgs(openUrlCommand, defaultMyContent) as string
            openWebPage(url)
        } else {
            command = parseCommand()
            initCommandArgs(command, pageCache)
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



