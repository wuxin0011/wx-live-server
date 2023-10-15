'use strict';

var child_process = require('child_process');
var fs = require('node:fs');
var http = require('node:http');
var worker_threads = require('worker_threads');
var path$1 = require('path');
var path = require('node:path');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var http__namespace = /*#__PURE__*/_interopNamespaceDefault(http);
var path__namespace$1 = /*#__PURE__*/_interopNamespaceDefault(path$1);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);

const htmlFile = {
    ext: /\.(html)$/i,
    className: 'html',
    icon: {
        content: '📘'
    }
};
const txtFile = {
    ext: /\.(txt|log)$/i,
    className: 'txt',
    icon: {
        content: '📄'
    }
};
const docFile = {
    ext: /\.(doc|docx)$/i,
    className: 'doc',
    icon: {
        content: '📗'
    }
};
const fontFile = {
    ext: /\.(ttf|woff|woff2)$/i,
    className: 'font',
    icon: {
        content: '🥦'
    }
};
const videoFile = {
    ext: /\.(ogg)$/i,
    className: 'video',
    icon: {
        content: '🌎'
    }
};
const musicFile = {
    ext: /\.(mp3|mp4)$/i,
    className: 'music',
    icon: {
        content: '🎹'
    }
};
const excelFile = {
    ext: /\.(xlsx|xls)$/i,
    className: 'excel',
    icon: {
        content: '📄'
    }
};
const vueFile = {
    ext: /\.(vue)$/i,
    className: 'vue',
    icon: {
        content: '🎄'
    }
};
const pythonFile = {
    ext: /\.(py)$/,
    className: 'python',
    icon: {
        content: '🦎'
    }
};
const goFile = {
    ext: /\.(go)$/i,
    className: 'go',
    icon: {
        content: '🐹'
    }
};
const rustFile = {
    ext: /\.(rs)$/i,
    className: 'rust',
    icon: {
        content: '🦏'
    }
};
const swiftFile = {
    ext: /\.(swift)$/i,
    className: 'swift',
    icon: {
        content: '🐬'
    }
};
const kotlinFile = {
    ext: /\.(kt)$/i,
    className: 'kotlin',
    icon: {
        content: '🐲'
    }
};
const phpFile = {
    ext: /\.(php)$/i,
    className: 'php',
    icon: {
        content: '🤖'
    }
};
const perlFile = {
    ext: /\.(pl)$/i,
    className: 'pl',
    icon: {
        content: '😺'
    }
};
const matlabFile = {
    ext: /\.(m)$/i,
    className: 'matlab',
    icon: {
        content: '🐻'
    }
};
const luaFile = {
    ext: /\.(lua)$/i,
    className: 'lua',
    icon: {
        content: '🐟'
    }
};
const cFile = {
    ext: /\.(c|cpp|h|cc|cxx)$/i,
    className: 'c',
    icon: {
        content: '🐳'
    }
};
const rFile = {
    ext: /\.(r)$/i,
    className: 'r',
    icon: {
        content: '🦮'
    }
};
const rubyFile = {
    ext: /\.(rb)$/i,
    className: 'rb',
    icon: {
        content: '🐷'
    }
};
const sqlFile = {
    ext: /\.(sql|bson|json|dump|bak|ldf|mdf|dmp|dat|idx)$/i,
    className: 'sql',
    icon: {
        content: '🛢'
    }
};
const apkFile = {
    ext: /\.(apk)$/i,
    className: 'apk',
    icon: {
        content: '📦'
    }
};
const imageFile = {
    ext: /\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/i,
    className: 'image',
    icon: {
        content: '🔎'
    }
};
const linkFile = {
    ext: /\.(link|lnk|ink)$/,
    className: 'link',
    icon: {
        content: '🔗'
    }
};
const mdFile = {
    ext: /\.(md)$/i,
    className: 'markdown',
    icon: {
        content: '⚽'
    }
};
const cssFile = {
    ext: /\.(css|scss|less)$/i,
    className: 'java',
    icon: {
        content: '🍉'
    }
};
const javaFile = {
    ext: /\.(java)$/,
    className: 'java',
    icon: {
        content: '💎'
    }
};
const javaClassFile = {
    ext: /\.(class)$/,
    className: 'class',
    icon: {
        content: '🏀'
    }
};
const jsFile = {
    ext: /\.(js|jsx)$/,
    className: 'js-jsx',
    icon: {
        content: '🧽'
    }
};
const tsFile = {
    ext: /\.(ts|tsx)$/,
    className: 'ts-tsx',
    icon: {
        content: '🛹'
    }
};
const configFile = {
    ext: /\.(ini|conf|cfg|rc|properties|plist|htaccess|cnf|yml|yaml|ddl)$/,
    className: 'config',
    icon: {
        content: '📚'
    }
};
const runFile = {
    ext: /\.(exe|sh|bat|msi|bin|out|jar)$/,
    className: 'run',
    icon: {
        content: '🚀'
    }
};
const filetypes = [
    apkFile,
    txtFile,
    htmlFile,
    rFile,
    perlFile,
    cFile,
    rustFile,
    rubyFile,
    goFile,
    phpFile,
    cssFile,
    mdFile,
    matlabFile,
    swiftFile,
    kotlinFile,
    luaFile,
    pythonFile,
    linkFile,
    vueFile,
    javaClassFile,
    javaFile,
    imageFile,
    docFile,
    excelFile,
    videoFile,
    musicFile,
    fontFile,
    sqlFile,
    jsFile,
    tsFile,
    configFile,
    runFile,
];

const unknownFile = 'unknown';
const getExt = (file) => {
    if (file.indexOf('.') !== -1) {
        let s = file.split('.');
        return s[s.length - 1];
    }
    else {
        return unknownFile;
    }
};
const getClassFileName = (className) => `${className}-file`;
const getClassName = (url) => {
    if (!url) {
        return getClassFileName(unknownFile);
    }
    for (let i = 0; i < filetypes.length; i++) {
        const ext = filetypes[i].ext;
        const className = filetypes[i].className;
        if (ext instanceof RegExp && ext.test(url)) {
            return getClassFileName(className);
        }
        else {
            if (ext instanceof String) {
                const e = getExt(url);
                if (e === unknownFile) {
                    return getClassFileName(unknownFile);
                }
                if (ext.indexOf(e) !== -1) {
                    return getClassFileName(className);
                }
            }
        }
    }
    return getClassFileName(unknownFile);
};
const getIconBeforeClass = () => {
    var _a, _b, _c, _d;
    let t = '';
    for (let i = 0; i < filetypes.length; i++) {
        let str = '';
        const icon = (_a = filetypes[i]) === null || _a === void 0 ? void 0 : _a.icon;
        const fileClassName = getClassFileName(filetypes[i].className);
        str = `.${fileClassName}::before`;
        str = str + `{
        content:"${(_b = icon === null || icon === void 0 ? void 0 : icon.content) !== null && _b !== void 0 ? _b : '🎈'}";
        width:${(_c = icon === null || icon === void 0 ? void 0 : icon.width) !== null && _c !== void 0 ? _c : 10}px;
        height:${(_d = icon === null || icon === void 0 ? void 0 : icon.height) !== null && _d !== void 0 ? _d : 10}px;
      }\n\n`;
        t += str;
    }
    return t;
};

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
    '.md': 'text/plain;charset=utf-8',
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
    '.mp4': 'video/mp4',
    '.json': 'application/json',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
};

class Page {
    constructor(url, content, is_html = false) {
        this.pageUrl = url;
        this.content = content;
        this.contentType = getType(url, is_html);
    }
}
const getType = (url, is_html = false) => is_html ? 'text/html;charset=utf-8' : MEDIA_TYPE[`.${getExt(url)}`] || `text/plain;charset=utf-8`;
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
        return -1;
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        else if (this.cache.size >= this.capacity) {
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
  <h2>页面未找到！</h2>
</body>

</html>
`;
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

      .folder::before{
        content: '👝';
      }

      .file::before{
        content: '🀄';
      }
      
      ${getIconBeforeClass()}
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
        width: 150px;
        overflow:hidden;
        padding: 10px;
      }
    </style>
    
  </head>
  
  <body>
    <div class="container"></div>
  </body>
  </html>
  `;

const RGB_VALUE_MAX = 255;
const BACKGROUND_COLOR = 48;
const FONT_COLOR = 38;
const COLOR_REFLEX = `\u001B[`;
const CLEAR_COLOR = `${COLOR_REFLEX}0m`;
const valid = (...ins) => {
    for (let result of ins) {
        if (result > RGB_VALUE_MAX) {
            throw new Error("color value max is " + RGB_VALUE_MAX);
        }
        if (result < 0) {
            throw new Error("color value min is 0 ");
        }
    }
};
class CustomColor {
    static fontColor(R, G, L, ...content) {
        return `${COLOR_REFLEX}${FONT_COLOR};2;${R};${G};${L}m${content}${CLEAR_COLOR}`;
    }
    static backgroundColor(R, G, L, ...content) {
        return `${COLOR_REFLEX}${BACKGROUND_COLOR};2;${R};${G};${L}m${content}${CLEAR_COLOR}`;
    }
    static backgroundAndFontColor(R, G, L, R1, G1, L1, ...content) {
        valid(R1, G1, L1, R, G, L);
        return `${COLOR_REFLEX}${BACKGROUND_COLOR};2;${R};${G};${L}m${COLOR_REFLEX}${FONT_COLOR};2;${R1};${G1};%${L1}m${content}${CLEAR_COLOR}`;
    }
}

const CACHE_COMMAND_KEY = 'CACHE_COMMAND_KEY';
let childWorkCommand = null;
const cacheUpdate = (message, pageCache) => {
    if (message instanceof Map) {
        for (let [k, v] of message.entries()) {
            if (k && k !== CACHE_COMMAND_KEY && v) {
                pageCache.set(k, v);
            }
        }
    }
};
let commandIsLoad = false;
const watchContent = (message) => {
    if (message instanceof Map) {
        for (let [k, v] of message.entries()) {
            if (k === CACHE_COMMAND_KEY && !commandIsLoad) {
                childWorkCommand = message.get(CACHE_COMMAND_KEY);
                commandIsLoad = true;
            }
            else if (commandIsLoad) {
                watchFileChange(v, message);
            }
        }
        worker_threads.parentPort.postMessage(message);
    }
};
const FileNotFounds = [];
const watchFileChange = (page, cache) => {
    if (!childWorkCommand) {
        return;
    }
    if (!(cache instanceof Map)) {
        return;
    }
    if (!(page === null || page === void 0 ? void 0 : page.pageUrl) || !(page === null || page === void 0 ? void 0 : page.content) || !(page === null || page === void 0 ? void 0 : page.contentType)) {
        return;
    }
    let pageUrl = page.pageUrl;
    if (FileNotFounds.indexOf(pageUrl) !== -1) {
        return;
    }
    let real_url = path__namespace.join(__dirname, childWorkCommand.root, pageUrl);
    console.log('watch url =', real_url);
    if (!fs__namespace.existsSync(real_url)) {
        FileNotFounds.push(pageUrl);
        return;
    }
    const status = fs__namespace.statSync(real_url);
    if (status.isDirectory()) {
        curReadFolder(real_url, cache, true);
    }
    else {
        try {
            const data = readFile(real_url);
            if (data) {
                cache.set(pageUrl, new Page(pageUrl, data));
            }
        }
        catch (error) {
            errorLog(error);
        }
    }
};
const childWorkerRun = (cmd, time = refreshTime, pageCache) => {
    const childWorker = new worker_threads.Worker(__filename);
    setInterval(() => {
        childWorker.postMessage(pageCache);
    }, time);
    childWorker.on('message', message => {
        cacheUpdate(message, pageCache);
    });
};

const isWindow = () => process.platform === 'win32';
const isMac = () => process.platform === 'darwin';
const createIndexHtml = (p, isParseIndexHtml = false, isSingle = false, indexName = indexHtml) => {
    return `${p}\\${indexHtml}`;
};
const getTagStr = (url, isFolder = false) => {
    const fileName = path__namespace.basename(url);
    if (isFolder) {
        return `<a class="folder" href="${url}">${fileName}</a>`;
    }
    else {
        return `<a class="file ${getClassName(url)}" href="${url}" >${fileName}</a>`;
    }
};
const getRequestUrl = (folderPath) => ("/" + folderPath.split(__dirname)[1].replace(/\\\\/ig, "/")).replace(/\\/ig, "/").replace(/\/\/\//g, "/").replace(/\/\//g, "/");
const readFile = (p, mode = 'utf-8') => {
    try {
        return fs__namespace.readFileSync(p);
    }
    catch (e) {
        errorLog(e);
        return '';
    }
};
const errorLog = (msg, log = "error.log") => {
    msg = `\n=================${new Date()}==============\n ${msg} \n==============================================================================`;
    fs__namespace.appendFile(path__namespace.join(__dirname, log), msg, (err) => {
        if (err) {
            console.warn('日志写入失败！', err);
        }
    });
};
const isAllowResolve = (url) => {
    return !/\.ico$/.test(url) && !(/http[s]:\/\//.test(url));
};
const getAbsoluteUrl = (url) => {
    return path__namespace.join(__dirname, rootFolder, url == '' ? '' : decodeURIComponent(handlerUrl(url)));
};
const handlerUrl = (url) => {
    if (!url) {
        return '';
    }
    if (url.indexOf('?') !== -1) {
        url = url.split('?')[0];
    }
    return url;
};
const curReadFolder = (folderPath = __dirname, cache, isParse = false) => {
    let thisCommand = cache.get(CACHE_COMMAND_KEY);
    let temp = '';
    const p = isParse ? folderPath : path__namespace.join(folderPath, thisCommand.root);
    let reqUrl = folderPath === __dirname ? '/' : decodeURIComponent(getRequestUrl(folderPath));
    let readContent = '';
    if (thisCommand.single) {
        const i = createIndexHtml(path__namespace.join(__dirname, thisCommand.root), false, true);
        if (fs__namespace.existsSync(i)) {
            readContent = fs__namespace.readFileSync(i);
        }
    }
    else if (thisCommand.isParseIndex) {
        const i = createIndexHtml(p);
        if (fs__namespace.existsSync(i)) {
            readContent = fs__namespace.readFileSync(i);
        }
    }
    else {
        const files = fs__namespace.readdirSync(folderPath);
        for (let i = 0; i < files.length; i++) {
            let fileName = files[i];
            const filePath = path__namespace.join(__dirname, thisCommand.root, fileName);
            try {
                let this_url = getRequestUrl(filePath);
                let isDirectory = fs__namespace.statSync(filePath).isDirectory();
                temp += getTagStr(this_url, isDirectory);
            }
            catch (error) {
                errorLog(error);
            }
        }
        let title = path__namespace.basename(reqUrl) === '/' || path__namespace.basename(reqUrl) === '' ? '首页' : path__namespace.basename(reqUrl);
        readContent = Template.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`).replace(/<div class="container">(.*?)<\/div>/, `<div class="container">${temp}</div>`);
    }
    cache.set(reqUrl, new Page(reqUrl, readContent, true));
    return readContent;
};
const colorUtils = {
    'success': function (...args) {
        console.log(CustomColor.fontColor(66, 211, 146, args));
    },
    'background': function (R, G, L, ...args) {
        console.log(CustomColor.fontColor(66, 211, 146, args));
    },
    'custom': function (background, fontColor, ...args) {
        console.log(CustomColor.backgroundAndFontColor(background.R, background.G, background.L, fontColor.R, fontColor.G, fontColor.L, args));
    }
};

class Command {
    constructor(p = port, i = indexHtml, isIndex = isParseIndexHtml, r = rootFolder, s = isSingle, o = isOpen, t = refreshTime, w = isWatch, l = isPrintLogo) {
        this.port = p;
        this.index = i;
        this.isParseIndex = isIndex;
        this.root = r;
        this.single = s;
        this.time = t;
        this.open = o;
        this.watch = w;
        this.logo = l;
    }
}
const helpCommand = '-h';
const indexCommand = '-index';
const isParseIndexCommand = '-i';
const openCommand = '-o';
const openUrlCommand = '-u';
const portCommand = '-p';
const watchCommand = '-w';
const singlePageCommand = '-s';
const rootCommand = '-r';
const refreshCommand = '-t';
const logoCommand = '-l';
const parseHelpCommand = () => {
    const helpContent = `
    node ${path__namespace$1.basename(__filename)} [command] \n
    command list: \n
        command                         description
        ===============================================================================================
        -h                 command Description 
        -p                 specify the startup port number default 8080,use -p=3000 
        -index             is it directly mapped to index.html? if it exists ,default false ,use -index=about.html 📗
        -i                 folder current html as main ,default every folder index.html ,if you want to custom, please use -index=custom.html !📗
        -r                 directly start open folder default current ,if you want ot use dist ,use -r=dist
        -t                 content refresh time default 3000 ,use -t=100 
        -w                 listener file update  default false use --w
        -o                 start open default browser ,if you want close ,please use -o=false 
        -u                 open a web page ,default my blog about this content ,-u=url 
        -s                 if your page is single please use -s,default false 
        -l                 print logo , default true , -l=false close logo
    `;
    colorUtils['success'](helpContent);
};
const includeCommand = (arg) => {
    if (!arg) {
        return false;
    }
    return process.argv.slice(2).findIndex(param => param.indexOf(arg) !== -1) !== -1;
};
const parseCommandArgs = (arg, defaultValue) => {
    if (defaultValue === undefined) {
        console.warn('defaultValue is undefined');
    }
    if (!arg) {
        console.warn('arg is null or undefined');
        return defaultValue;
    }
    const args = process.argv.slice(2);
    for (let i = 0; i < args.length; i++) {
        const param = args[i];
        if (param.indexOf(arg) !== -1) {
            if (param.indexOf('=') !== -1) {
                let s = param.split('=');
                return s[s.length - 1];
            }
            else {
                console.warn(`${arg} args should like key=value`);
                return defaultValue;
            }
        }
    }
    return defaultValue;
};
const parseStringOrBoolCommand = (commandArg, defaultValue) => {
    let result = defaultValue;
    if (includeCommand(commandArg)) {
        result = parseCommandArgs(commandArg, defaultValue);
    }
    return result;
};
const parseTimeCommand = () => {
    let time = refreshTime;
    if (includeCommand(refreshCommand)) {
        try {
            time = Number(parseCommandArgs(refreshCommand, 3000));
            if (isNaN(time)) {
                console.warn('refreshTime must be a number  use default 3000!');
                time = refreshTime;
            }
            if (time <= 1000) {
                console.warn('refreshTime min should >=1000');
                time = 1000;
            }
        }
        catch (error) {
            console.log(`${refreshCommand} command is parse fail ,${error}`);
            time = refreshTime;
        }
    }
    return time;
};
const parsePortCommand = () => {
    let p = port;
    if (includeCommand(portCommand)) {
        try {
            p = parseInt(parseCommandArgs(portCommand, port));
            if (p <= 1) {
                console.log(`port can not ${p} `);
                p = port;
            }
        }
        catch (error) {
            p = port;
            console.log(`${portCommand} command is parse fail,because ${error}`);
        }
    }
    return p;
};
const parseRootCommand = () => {
    let d = rootFolder;
    if (includeCommand(rootCommand)) {
        d = parseCommandArgs(rootCommand, d);
        const f = path__namespace$1.join(__dirname, d);
        if (d !== rootFolder) {
            if (!fs__namespace.existsSync(f) || !fs__namespace.statSync(f).isDirectory()) {
                throw new Error(`folder ${f} not exist ,please check!`);
            }
        }
    }
    return d;
};
const parseSingleCommand = () => {
    let curr = parseRootCommand();
    let s;
    if (includeCommand(singlePageCommand)) {
        s = true;
        let i = parseCommandArgs(indexCommand, indexHtml);
        const file = path__namespace$1.join(__dirname, curr, i);
        if (!fs__namespace.existsSync(file)) {
            throw new Error(`folder ${file} not exist,please check!`);
        }
    }
    return s;
};
const parseCommand = () => {
    let s = parseSingleCommand();
    let p = parsePortCommand();
    let t = parseTimeCommand();
    let d = parseRootCommand();
    let isParseInndex = parseStringOrBoolCommand(isParseIndexCommand, isParseIndexHtml);
    let directIndexHtmlFile = parseStringOrBoolCommand(indexCommand, indexHtml);
    let o = parseStringOrBoolCommand(openCommand, isOpen);
    let w = parseStringOrBoolCommand(watchCommand, isWatch);
    let l = parseStringOrBoolCommand(logoCommand, isPrintLogo);
    return new Command(p, directIndexHtmlFile, isParseInndex, d, s, o, t, w, l);
};

const logo = `
#    # #    #       #      # #    # ######        ####  ###### #####  #    # ###### #####  
#    #  #  #        #      # #    # #            #      #      #    # #    # #      #    # 
#    #   ##   ##### #      # #    # #####  #####  ####  #####  #    # #    # #####  #    # 
# ## #   ##         #      # #    # #                 # #      #####  #    # #      #####  
##  ##  #  #        #      #  #  #  #            #    # #      #   #   #  #  #      #   #  
#    # #    #       ###### #   ##   ######        ####  ###### #    #   ##   ###### #    # 
`;

const allReqUrl = [];
const MAX_PAGE_SIZE = 100;
const NotFoundPageUrl = [];
const pageCache = new LRUCache(MAX_PAGE_SIZE);
const NOT_FOUND_PAGE = new Page("404.html", NotFound, true);
const hostname = '127.0.0.1';
let count = 0;
let isParseIndexHtml = false;
let indexHtml = 'index.html';
let refreshTime = 3000;
let rootFolder = '.';
let port = 8080;
let isWatch = false;
let isSingle = false;
let isOpen = true;
let isPrintLogo = true;
let command = null;
let defaultMyContent = 'https://wuxin0011.github.io/tools/node-live-serve/';
const server = http__namespace.createServer((request, response) => {
    let req_url = decodeURIComponent(handlerUrl(request.url));
    console.log('req_url = >', req_url);
    if (NotFoundPageUrl.indexOf(request.url) !== -1) {
        responseTemplate(request, response, NOT_FOUND_PAGE);
        return;
    }
    if (isAllowResolve(req_url)) {
        if (allReqUrl.indexOf(req_url) === -1) {
            responseContent(request, response);
            return;
        }
        const cacheContent = pageCache.get(req_url);
        if (cacheContent == -1) {
            responseContent(request, response);
            return;
        }
        responseTemplate(request, response, (cacheContent !== null && cacheContent !== void 0 ? cacheContent : NOT_FOUND_PAGE));
    }
});
const responseContent = (request, response) => {
    let url = handlerUrl(request.url);
    let real_url = getAbsoluteUrl(url);
    let requestUrl = decodeURIComponent(url);
    console.log('real_url', real_url);
    if (!fs__namespace.existsSync(real_url)) {
        responseErrorPage(request, response, "请求内容不存在");
        return;
    }
    try {
        const status = fs__namespace.statSync(real_url);
        if (getExt(url) === unknownFile) {
            if (status.isDirectory() && isParseIndexHtml) {
                const indexHtml = createIndexHtml(real_url, true);
                if (fs__namespace.existsSync(indexHtml)) {
                    let content = readFile(indexHtml);
                    const this_page = new Page(requestUrl, content, false);
                    responseTemplate(request, response, this_page);
                    allReqUrl.push(requestUrl);
                    pageCache.set(requestUrl, this_page);
                }
            }
            return;
        }
        if (status.isDirectory()) {
            curReadFolder(real_url, pageCache.cache);
            const page = pageCache.get(requestUrl);
            responseTemplate(request, response, page !== -1 ? page : NOT_FOUND_PAGE);
        }
        else {
            const content = readFile(real_url);
            if (!content) {
                if (!isSingle) {
                    responseErrorPage(request, response, "请求内容不存在");
                    NotFoundPageUrl.push(requestUrl);
                }
            }
            else {
                const this_page = new Page(requestUrl, content, false);
                responseTemplate(request, response, this_page);
                allReqUrl.push(requestUrl);
                pageCache.set(requestUrl, this_page);
            }
        }
    }
    catch (error) {
        responseErrorPage(request, response, error);
        return;
    }
};
const responseErrorPage = (request, response, message, template, url) => {
    let errorContent = null;
    url = url !== null && url !== void 0 ? url : request.url;
    template = template !== null && template !== void 0 ? template : NotFound;
    if (message) {
        errorContent = template.replace(/<h2>(.*?)<\/h2>/, `<h2 style="color:red;">${message.toString()}<\/h2>`);
    }
    responseTemplate(request, response, new Page(url, message && errorContent ? errorContent : 'error', true));
};
const responseTemplate = (request, response, page) => {
    try {
        response.setHeader('Content-Type', page.contentType);
        response.write(page.content);
        response.end();
    }
    catch (error) {
    }
};
const openWebPage = (url) => {
    let command = '';
    let isInitSystemCommand = false;
    if (!isInitSystemCommand) {
        if (isWindow()) {
            command = 'start';
            isInitSystemCommand = true;
        }
        else if (isMac()) {
            command = 'open';
            isInitSystemCommand = true;
        }
        else {
            isInitSystemCommand = false;
        }
    }
    if (isInitSystemCommand) {
        child_process.exec(`${command} ${url}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`浏览器打开失败！错误详情: ${error}`);
                errorLog(error);
                return;
            }
            if (stderr) {
                console.error(`浏览器打开失败！错误详情: ${stderr}`);
                errorLog(error);
                return;
            }
        });
    }
    else {
        console.log('当前环境不支持打开默认浏览器 请手动打开！');
    }
    if (isPrintLogo) {
        colorUtils['success'](logo);
    }
    console.log(`live-server 启动成功！点击访问 ${url}`);
};
const initCommandArgs = (command, cache) => {
    if (!command) {
        return;
    }
    console.log('command = >', command);
    port = command.port;
    indexHtml = command.index;
    isParseIndexHtml = command.isParseIndex;
    rootFolder = command.root;
    isSingle = command.single;
    isOpen = command.open;
    refreshTime = command.time;
    isWatch = command.watch;
    isPrintLogo = command.logo;
    cache.set(CACHE_COMMAND_KEY, command);
};
const run = () => {
    let firstStart = true;
    const start = (error) => {
        if (count < 20) {
            if (!firstStart) {
                port += 1;
                count += 1;
            }
            try {
                server.listen({
                    host: hostname,
                    port: port
                }, () => {
                    curReadFolder(getAbsoluteUrl(''), pageCache.cache, false);
                    if (isOpen) {
                        openWebPage(`http://${hostname}:${port}`);
                    }
                    if (isWatch) {
                        childWorkerRun(command, refreshTime, pageCache);
                    }
                    firstStart = false;
                });
                server.on('error', (error) => {
                    firstStart = false;
                    start(error);
                });
            }
            catch (error) {
                firstStart = false;
                start(error);
            }
        }
        else {
            console.error('启动失败:', error);
            server.close();
            errorLog(error);
        }
    };
    try {
        if (includeCommand(helpCommand) || includeCommand('help')) {
            parseHelpCommand();
        }
        else if (includeCommand(openUrlCommand)) {
            const url = parseCommandArgs(openUrlCommand, defaultMyContent);
            openWebPage(url);
        }
        else {
            command = parseCommand();
            initCommandArgs(command, pageCache);
            start(null);
        }
    }
    catch (e) {
        console.log("error:", e);
    }
};
const bootStrap = () => {
    if (worker_threads.isMainThread) {
        run();
    }
    else {
        worker_threads.parentPort.on('message', message => {
            watchContent(message);
        });
    }
};

bootStrap();
