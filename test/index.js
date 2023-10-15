const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const nodeURL = require('node:url')
const {
    Worker,
    isMainThread,
    parentPort
} = require('worker_threads');
const {
    exec
} = require('child_process');


const NotFound = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>
  <style>

  * {
    margin: 0;
    padding: 0;
  }

  html,body {
    height: 100vh;
    background:url("https://wuxin0011.github.io/fantasy/screen.png");
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    font-size:40px;
  }

</style>
</head>

<body>
  <h2>未知错误</h2>
</body>

</html>
`


const Template = `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>template</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      body {
        height: 100vh;
        background-color: #eee;
      }
      .unknown-file::before {
        content: '❓';
      }
      .folder::before,.file::before{
        content: '👝';
      }
      .html-file::before {
        content: '📘';
      }
      .log-file::before,.json-file::before {
        content: '📄';
      }
      .apk-file::before {
        content: '📦';
      }
      .css-file::before {
        content: '🌼';
      }
      .js-file::before {
        content: '🍟';
      }
      .ini-file::before,.config-file::before,.xml-file::before {
        content: '🍎';
      }
      .js-file::before {
        content: '🍧';
      }
      .java-file::before{
        content: '🍉';
      }
      .vue-file::before{
        content: '📀';
      }
      .ts-file::before{
        content: '📗';
      }
      .jsx-file::before{
        content: '🎇';
      }
      .tsx-file::before{
        content: '🧿';
      }
      .iml-file::before{
        content: '🎗';
      }
      .class-file::before{
        content: '💎';
      }
      .md-file::before{
         content: '📒';
      }

      .txt-file::before{
           content: '📄';
       }

      .jar-file::before,
      .docker-file::before,
      .exe-file::before,
      .run-file::before{
        content: '🚀';
      }

      .python-file::before{
        content: '🦎';
      }

       .c-file::before{
        content: '🛢';
      }

      .r-file::before{
        content: '🍥';
      }
     
      .rust-file::before{
        content: '🍔';
      }

      .ruby-file::before{
        content: '🍿';
      }
     
       .go-file::before{
        content: '🥝';
      }

      .php-file::before{
        content: '🥪';
      }

      .kotlin-file::before{
        content: '🍧';
      }

      .matlab-file::before{
        content: '🥙';
      }
     .perl-file::before{
        content: '🍿';
      }
       .lua-file::before{
        content: '🧀';
      }
      .swift-file::before{
        content: '🍭';
      }
     
      .pdf-file::before {
        content: '📕';
      }
      .database-file::before {
        content: '👔';
      }
       .compress-file::before {
        content: '🥅';
      }
      .link-file::before,
      .lnk-file::before,
      .ink-file::before,
      .gif-file::before{
        content: '🔗';
      }
      .img-file::before {
        content: '🔎';
      }

      .doc-file::before ,
      .docx-file::before{
        content: '📝';
      }
      .ppt-file::before , 
      .pptx-file::before{
        content: '🧨';
      }
      .xlsx-file::before , 
      .xls-file::before{
        content: '📊';
      }
      .ttf-file::before , 
      .woff-file::before,
      .woff2-file::before{
        content: '🌰';
      }

      .ogg-file::before , 
      .mp3-file::before{
        content: '🥭';
      }
     
      a {
        text-decoration: none;
        cursor: pointer;
        color: #000;
        transition: all ease-in-out 0.3s;
      }
      a:hover {
        color: teal;
      }
      .container {
        display: flex;
        width: 75%;
        margin: 0 auto;
        margin-top: 100px;
        flex-wrap: wrap;
      }
      .container a {
        display: inline-block;
        margin: 10px;
        width: 200px;
        overflow:hidden;
        padding: 10px;
      }
    </style>
    
  </head>
  
  <body>
    <div class="container"></div>
  </body>
  </html>
  `

const isWindow = () => process.platform === 'win32'
const isMac = () => process.platform === 'darwin'
// 获取文件后缀
const getExt = (urlString) => path.extname(nodeURL.parse(urlString).pathname)

const createIndexPage = (url) => `${isSingle ? path.join(__dirname, directorFolder, indexPage) : `${url}//${indexPage}`}`

// 文件类型判断
const isHTML = (file) => /\.html$/.test(file)
const isTxt = (file) => /\.(txt|log)/.test(file)
const isCss = (file) => /\.(css)$/.test(file)
const isJs = (file) => /\.(js)$/.test(file)
const isJsx = (file) => /\.(jsx)$/.test(file)
const isTs = (file) => /\.ts$/.test(file)
const isTsx = (file) => /\.(tsx)$/.test(file)
const isVue = (file) => /\.(vue)$/.test(file)
const isPython = (file) => /\.(py)$/.test(file)
const isRuby = (file) => /\.(rb)$/.test(file)
const isGo = (file) => /\.(go)$/.test(file)
const isRust = (file) => /\.(rs)$/.test(file)
const isSwift = (file) => /\.(swift)$/.test(file)
const isKotlin = (file) => /\.(kt)$/.test(file)
const isPhp = (file) => /\.(php)$/.test(file)
const isPerl = (file) => /\.(pl)$/.test(file)
const isMatlab = (file) => /\.(m)$/.test(file)
const isLua = (file) => /\.(lua)$/.test(file)
const isC = (file) => /\.(c|cpp|h|cc|cxx)$/.test(file)
const isR = (file) => /\.(r)$/.test(file)
const isClassFile = (file) => /\.(class)$/.test(file)
const isJavaFile = (file) => /\.(java)$/.test(file)
const isSQL = (file) => /\.(sql|bson|json|dump|bak|ldf|mdf|dmp|dat|idx)$/i.test(file)
const isApk = (file) => /\.(apk)$/i.test(file)
const isImage = (file) => /\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/.test(file)
const isLink = (file) => /\.(link|lnk|ink)$/.test(file)
const isCompress = (file) => /\.(zip|gz|tar|7z|rar|gzip|bzip|bzip2)$/i.test(file)
const isMd = (file) => /\.(md)$/.test(file)
const isRunFile = (file) => /\.(exe|sh|com|bat|msi|dll|bin|out|pl|jar)$/i.test(file)
const isConfigFile = (file) => /\.(ini|conf|cfg|rc|properties|plist|htaccess|cnf|yml|yaml|ddl)$/i.test(file)

// 针对不同请求返回不同格式
const getType = (url, is_html = false) => is_html ? 'text/html;charset=utf-8' : MEDIA_TYPE[getExt(url)] || `text/plain;charset=utf-8`

const getTagStr = (url, isFolder = false) => {
    const fileName = path.basename(url)
    if (isFolder) {
        return `<a class="folder" href="${url}">${fileName}</a>`
    } else {
        return `<a class="file ${getClassName(url)}" href="${url}" >${fileName}</a>`
    }

}

// 将 \ 或者 \\ 或者 // 转换成 /
const getRequestUrl = (folderPath) => {
    return ("/" + folderPath.split(path.join(__dirname, directorFolder))[1].replace(/\\\\/ig, "/")).replace(/\\/ig, "/").replace(/\/\/\//g, "/").replace(/\/\//g, "/")
}


// 文件同步读取
const readFile = (p, mode = 'utf-8') => {
    try {
        if (!fs.existsSync(p)) {
            errorLog(`文件不存在！${p}`)
            return ''
        }
        return fs.readFileSync(p)
    } catch (e) {
        errorLog(e)
        return ''
    }
}
const errorLog = (msg, log = "error.log",) => {
    msg = `\n=================${new Date()}==============\n ${msg} \n==============================================================================`
    fs.appendFile(path.join(__dirname, directorFolder, log), msg, (err) => {
        if (err) {
            console.warn('日志写入失败！', err)
        }
    })
}

// 暂时不处理ico格式文件
// 在此处可以错拦截请求管理
const isAllowResolve = (url) => {
    return !(url.indexOf('favicon.ico') !== -1) && !(url.startsWith('http://') || url.startsWith('https://'))
}


const MEDIA_TYPE = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.csv': 'text/csv;charset=utf-8',
    '.html': 'text/html;charset=utf-8',
    '.txt': 'text/plain;charset=utf-8',
    '.log': 'text/plain;charset=utf-8',
    '.css': 'text/css;charset=utf-8',
    '.js': 'text/javascript;charset=utf-8',
    '.md': 'text/plain;charset=utf-8', // 暂时将md文件设置为浏览器可读
    '.xml': 'application/xml',
    '.pdf': 'application/pdf',
    '.xlsx': 'application/vnd.ms-excel',
    '.xls': 'application/vnd.ms-excel',
    '.doc': 'application/msword',
    '.docx': 'application/msword',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.ms-powerpoint',
    '.ttf': 'application/font-woff',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff',
    '.zip': 'application/zip',
    '.7z': 'application/zip',
    '.tar': 'application/zip',
    '.rar': 'application/zip',
    '.gzip': 'application/zip',
    '.bzip': 'application/zip',
    '.bzip2': 'application/zip',
    '.mp4': 'video/mp4',
    '.json': 'application/json',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
};


const getClassName = (url) => {

    if (isMd(url)) {
        return 'md-file'
    }
    if (isHTML(url)) {
        return 'html-file'
    }
    if (isMatlab(url)) {
        return 'matlab-file'
    }
    if (isPython(url)) {
        return 'python-file'
    }
    if (isR(url)) {
        return 'r-file'
    }
    if (isSwift(url)) {
        return 'swift-file'
    }
    if (isGo(url)) {
        return 'go-file'
    }
    if (isJs(url)) {
        return 'js-file'
    }
    if (isPerl(url)) {
        return 'pl-file'
    }
    if (isRust(url)) {
        return 'rust-file'
    }
    if (isRuby(url)) {
        return 'ruby-file'
    }
    if (isKotlin(url)) {
        return 'kotlin-file'
    }
    if (isPhp(url)) {
        return 'php-file'
    }
    if (isLua(url)) {
        return 'lua-file'
    }
    if (isC(url)) {
        return 'c-file'
    }
    if (isJsx(url)) {
        return 'jsx-file'
    }
    if (isTs(url)) {
        return 'ts-file'
    }
    if (isTsx(url)) {
        return 'tsx-file'
    }
    if (isVue(url)) {
        return 'vue-file'
    }
    if (isCss(url)) {
        return 'css-file'
    }
    if (isTxt(url)) {
        return 'txt-file'
    }
    if (isJavaFile(url)) {
        return 'java-file'
    }
    if (isClassFile(url)) {
        return 'class-file'
    }
    if (isConfigFile(url)) {
        return 'config-file'
    }
    if (isImage(url)) {
        return 'img-file'
    }
    if (isLink(url)) {
        return 'link-file'
    }
    if (isRunFile(url)) {
        return 'run-file'
    }
    if (isApk(url)) {
        return 'apk-file'
    }
    if (isSQL(url)) {
        return 'database-file'
    }
    if (isCompress(url)) {
        return 'compress-file'
    }
    return MEDIA_TYPE[getExt(url)] ? `${getExt(url).replace(/\./, '')}-file` : 'unknown-file'
}

// 页面
class Page {
    constructor(url, content, is_html = false) {
        this.pageUrl = url
        this.content = content
        this.contentType = getType(url, is_html)
    }
}

// LRU缓存
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1; // 如果缓存中不存在指定的键，则返回 -1
    }

    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }

    remove(key) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
    }
}


const allReqUrl = []
const MAX_PAGE_SIZE = 100
const NotFoundPageUrl = []
const NOT_FOUND_PAGE = new Page("404.html", NotFound, true)
const COMMAND_KEY = "COMMAND_KEY"
const hostname = '127.0.0.1'
let count = 0
let pageCache = null
/* command args */
let port = 8080
let isParseIndexHtml = false // 是否直接映射当前目录中index.html 对于单文件app应该是启用这个参数
let indexPage = 'index.html'
let isSingle = false // 是否是单文件
let directorFolder = '.'
let refreshTime = 3000


/**
 * 启动入口
 */
const server = http.createServer((request, response) => {
    let req_url = decodeURIComponent(request.url)
    // 是否是错误请求
    if (NotFoundPageUrl.indexOf(request.url) !== -1) {
        responseTemplate(request, response, NOT_FOUND_PAGE)
        return;
    }
    // 是否是允许的请求
    if (isAllowResolve(req_url)) {
        // 请求是否存在以及是否缓存了如果请求没有缓存走该请求
        if (allReqUrl.indexOf(req_url) === -1) {
            responseContent(request, response)
            return;
        }
        // 响应处理
        const cacheContent = pageCache.get(req_url)
        if (cacheContent === -1) {
            responseContent(request, response)
            return;
        }
        responseTemplate(request, response, cacheContent ?? NOT_FOUND_PAGE)
    }
})


const hasExt = (url) => {
    return !!url && ((url.indexOf('.') !== -1) || url === '/')
}
/**
 * 请求的文件
 * @param {*} request 请求
 * @param {*} response 响应
 */
const responseContent = (request, response) => {

    let url = request.url
    const parsedUrl = nodeURL.parse(request.url, true);
    // 获取URL中的哈希部分
    // console.log('请求路径',parsedUrl)
    if (url.indexOf('?') !== -1) {
        const arr = url.split('?')
        url = arr[0]
    }

    let real_url = path.join(__dirname, directorFolder, decodeURIComponent(url));
    let requestUrl = decodeURIComponent(url)
    try {
        const status = fs.statSync(real_url)
        // 对于没有后缀并且不是文件夹的内容直接不处理！
        if (!hasExt(url)) {
            if (status.isDirectory() && isParseIndexHtml) {
                const indexHtml = createIndexPage(real_url)
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
            // 读取文件夹内容
            curReadFolder(real_url)
            // 响应一个生成的页面
            const page = pageCache.get(requestUrl)
            responseTemplate(request, response, page !== -1 ? page : NOT_FOUND_PAGE)
        } else {
            const content = readFile(real_url)
            if (!content) {
                if (!isSingle) {
                    responseErrorPage(request, response, "请求内容不存在")
                    // 缓存本次请求
                    NotFoundPageUrl.push(requestUrl)
                }

            } else {
                // 响应页面内容
                const this_page = new Page(requestUrl, content, false)
                responseTemplate(request, response, this_page)
                // 缓存本次 请求
                allReqUrl.push(requestUrl)
                pageCache.set(requestUrl, this_page)
            }
        }
    } catch (error) {
        if (!isSingle) {
            responseErrorPage(request, response, error)
        }
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
const responseErrorPage = (request, response, message, template, url) => {
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
const responseTemplate = (request, response, page) => {
    try {
        response.setHeader('Content-Type', page.contentType);
        // !!! todo 如果直接使用内容长短不知道为什么报错 容易确实文件
        // response.setHeader('Content-length', page.content.length);
        response.write(page.content);
        response.end();
    } catch (error) {
        // ignore ...
    }
}


/**
 * 响应文件下第一层文件，包括文件和目录
 * @param {*} folderPath 路径
 * @param cache
 */
const curReadFolder = (folderPath, cache = pageCache) => {
    let content = ''
    let reqUrl = folderPath === path.join(__dirname, directorFolder) ? '/' : decodeURIComponent(getRequestUrl(folderPath))
    const indexHtml = createIndexPage(folderPath)
    if (isParseIndexHtml && fs.existsSync(indexHtml)) {
        content = readFile(indexHtml)
    } else {
        let temp = ''
        // curr file
        const files = fs.readdirSync(folderPath)
        files.forEach((fileName) => {
            const filePath = path.join(folderPath, fileName);
            try {
                // file url => file content
                let this_url = getRequestUrl(filePath)
                let isDirectory = fs.statSync(filePath).isDirectory()
                temp += getTagStr(this_url, isDirectory)
            } catch (error) {
                errorLog(error)
                console.warn('stats error:', error)
            }
        });
        // create title 🧵
        let title = path.basename(reqUrl) === '/' || path.basename(reqUrl) === '' ? '首页' : path.basename(reqUrl)
        content = Template.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`).replace(/<div class="container">(.*?)<\/div>/, `<div class="container">${temp}</div>`)
    }
    cache.set(reqUrl, new Page(reqUrl, content, true))
    allReqUrl.push(reqUrl)
    return content
}


/* child worker */
const watch = (message) => {
    if (message instanceof Map) {
        for (let [k, v] of message.entries()) {
            if (k === COMMAND_KEY) {
                // init child params!
                const command = message.get(COMMAND_KEY)
                isParseIndexHtml = command.index
                indexPage = command.indexPage
                directorFolder = command.directorFolder
                isSingle = command.single
                port = command.port
                refreshTime = command.refresh
            } else {
                watchFileChange(v, message)
            }
        }
        // update content notify parent !
        parentPort.postMessage(message);
    }

}


const watchFileChange = (page, cache) => {
    if (!(cache instanceof Map)) {
        return;
    }
    if (!page?.pageUrl || !page?.content || !page?.contentType) {
        return;
    }
    let pageUrl = page.pageUrl
    let real_url = path.join(__dirname, directorFolder, decodeURIComponent(pageUrl));
    if (!fs.existsSync(real_url)) {
        console.log('file or folder is not exist:', real_url)
        return;
    }
    const status = fs.statSync(real_url)

    if (status.isDirectory()) {
        curReadFolder(real_url, cache)
    } else {
        try {
            const data = readFile(real_url)
            if (data.toString() !== page.content.toString()) {
                cache.set(pageUrl, new Page(pageUrl, data))
            }
        } catch (error) {
            errorLog(error)
        }

    }


}


const openWebPage = (url = `http://${hostname}:${port}`) => {
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
            // Linux ? or unknown platform
            isInitSystemCommand = false
        }
    }

    if (isInitSystemCommand) {
        exec(`${command} ${url}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`浏览器打开失败！错误详情: ${error}`);
                errorLog(error)
                return;
            }
            if (stderr) {
                console.error(`浏览器打开失败！错误详情: ${stderr}`);
                errorLog(error)
                return;
            }
            console.log(`live-server 启动成功！点击访问 ${url}`)
        })
    } else {
        console.log(`当前环境不支持打开默认浏览器 请手动打开！${url}`)
    }
}


const cacheUpdate = (message) => {
    if (!(message instanceof Map)) {
        return;
    }
    for (let [k, v] of message.entries()) {
        if (k !== COMMAND_KEY) {
            pageCache.set(k, v)
        }
    }
}


class Command {

    /**
     *
     * @param index 是否默认打开 指定 页 默认是 index.html
     * @param indexPage 默认页 index.html
     * @param root 项目启动指定跟路径 默认 当前路径
     * @param single 是否开启单文件模式
     * @param port 端口号
     * @param refresh 刷新时间间隔
     */
    constructor(index, indexPage, root, single, port, refresh) {
        this.index = !!index
        this.indexPage = indexPage
        this.directorFolder = root
        this.single = single
        this.port = isNaN(Number(port)) ? 8080 : Number(port)
        this.refresh = isNaN(Number(refresh)) ? 3000 : Number(refresh)
        // todo more command
    }
}

let commandObj = null


const childWorkerRun = () => {
    const childWorker = new Worker(__filename);
    pageCache.cache.set(COMMAND_KEY, commandObj)
    setInterval(() => {
        childWorker.postMessage(pageCache.cache);
    }, refreshTime);
    childWorker.on('message', message => {
        cacheUpdate(message)
    });
}

const runCommand = () => {
    if (includeCommand('--blog') || includeCommand('-b')) {
        openWebPage('https://wuxin0011.github.io/tools/node-live-serve/')
    } else if (includeCommand(help) || includeCommand('-h')) {
        helpCommand()
    } else {
        console.log(`\nuse node ${path.basename(__filename)} ${help} look more \n`)
        parseParseIndexHtmlParams()
        parseSingleParams()
        parseRefreshTimeParams()
        parsePortParams()
        run()
    }
}


const run = () => {
    /* init command  */
    commandObj = new Command(isParseIndexHtml, indexPage, directorFolder, isSingle, port, refreshTime)
    /* init cache */
    pageCache = new LRUCache(MAX_PAGE_SIZE)

    // run
    const start = (error) => {
        if (count < 20) {
            try {
                server.listen({
                    host: hostname,
                    port: port
                }, () => {
                    curReadFolder(path.join(__dirname, directorFolder))
                    openWebPage()
                    childWorkerRun()
                })
                server.on('error', (error) => {
                    console.error(`run fail ${error} `)
                    port += 1
                    count += 1
                    start(error)
                })
            } catch (error) {
                console.error(`run fail ${error} `)
                port += 1
                count += 1
                start(error)
            }

        } else {
            console.error('启动失败:', error)
            server.close()
            errorLog(error)
        }
    }
    start()
}


const includeCommand = (arg) => {
    if (!arg) {
        return false
    }
    return process.argv.findIndex(param => param.indexOf(arg) !== -1) !== -1
}


const parseCommandArgs = (arg, defaultValue) => {
    if (defaultValue === undefined) {
        console.log('defaultValue is undefined')
        return undefined;
    }
    if (!arg) {
        console.log('args is null or undefined')
        return defaultValue
    }
    for (let i = 0; i < process.argv.length; i++) {
        const params = process.argv[i]
        if (params.indexOf(arg) !== -1) {
            if (params.indexOf('=') !== -1) {
                let s = params.split('=')
                return s[s.length - 1]
            } else {
                return defaultValue
            }
        }
    }
    return defaultValue
}


const help = '--help'
const parseIndexHtml = '--index'
const portCommand = '--port'
const refreshCommand = '--time'
const helpCommand = () => {
    console.log(`
  node ${path.basename(__filename)} [command] \n
  command list: \n
      command         description
      ===============================================================================================
      --help,-h       command Description
      --blog,-b       open blog url address https://wuxin0011.github.io/tools/node-live-serve/ 
      --port,-p       specify the startup port number default ${port}
      --root,-r       directly root folder ,if you want dist to root folder , use --root=dist
      --index,-i      is it directly mapped to ${indexPage}? if it exists,you can directly index page  ,
                      default ${isParseIndexHtml} ,example --index=index.html or -i=index.html 
      --single,-s     if your app is single app please use --single,
                      use -s or --single
      --time,-t       content refresh time default ${refreshTime},example --time=3000  
  `)
}


const parseParseIndexHtmlParams = () => {
    if (includeCommand(parseIndexHtml)) {
        isParseIndexHtml = true
        indexPage = parseCommandArgs(parseIndexHtml, indexPage)
    } else if (includeCommand('-i')) {
        isParseIndexHtml = true
        indexPage = parseCommandArgs('-i', indexPage)
    }
}

const parseSingleParams = () => {

    if (includeCommand('--root') || includeCommand('-r')) {
        directorFolder = parseCommandArgs(includeCommand('--root') ? '--root' : '-r', directorFolder)
        // check file is exist ?
        const file = path.join(__dirname, directorFolder)
        if (!fs.existsSync(file)) {
            throw new Error(`${directorFolder} folder is not exist ,please check folder exist!, example --root=dist or -r=dist !`)
        }
    }
    if (includeCommand('--single') || includeCommand('-s')) {
        isSingle = true
        isParseIndexHtml = true
        // check file is exist ?
        const file = path.join(__dirname, directorFolder, indexPage)
        if (!fs.existsSync(file)) {
            throw new Error(`${file} is not exist ,please check file !`)
        }
    }
}


const parseRefreshTimeParams = () => {
    if (includeCommand(refreshCommand) || includeCommand('-t')) {
        try {
            refreshTime = Number(parseCommandArgs(includeCommand('-t') ? '-t' : refreshCommand, 3000))
            if (isNaN(refreshTime)) {
                console.warn('refreshTime must be a number  use default 3000!')
                refreshTime = 3000
            }
            if (refreshTime < 16) {
                console.warn(`refreshTime ${refreshTime} not allow refreshTime min>=16,with use default 3000  `)
                refreshTime = 3000
            }
        } catch (error) {
            console.log(`${refreshCommand} command is parse fail ,${error}`)
            refreshTime = 3000
        }
    }
}
const parsePortParams = () => {
    if (includeCommand(portCommand) || includeCommand('-p')) {
        try {
            port = parseInt(parseCommandArgs(includeCommand('-p') ? '-p' : portCommand, port))
            if (port <= 1) {
                console.warn(`port ${port} not allow ,with use default `)
                port = 8080
            }
        } catch (error) {
            port = 8080
            console.log(`${portCommand} command is parse fail port default 8080! `)
        }
    }
}


const bootStrap = () => {
    if (isMainThread) {
        runCommand()
    } else {
        parentPort.on('message', message => {
            watch(message)
        });
    }
}


/* run  */
bootStrap()
