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

const config = {
    port: 8080,
    index: 'index.html',
    parseIndex: false,
    single: false,
    watch: false,
    open: true,
    time: 3000,
    logo: true,
    root: '.',
    base: '/',
    ignoreBase: '',
    ignoreFile: '',
};

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
const CACHE_COMMAND_KEY = 'CACHE_COMMAND_KEY';

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

const isWindow = () => process.platform === 'win32';
const isMac = () => process.platform === 'darwin';
const createIndexHtml = (p, config) => {
    if (config.single) {
        return path__namespace.join(getAbsoutePath(config.root), config.index);
    }
    if (p.indexOf(getAbsoluteUrl(config.root)) !== -1) {
        return path__namespace.join(p, config.index);
    }
    else {
        return path__namespace.join(getAbsoutePath(config.root), p, config.index);
    }
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
const getRequestUrl = (folderPath, rootDir) => {
    return ("/" + folderPath.split(getAbsoutePath(rootDir))[1].replace(/\\\\/ig, "/"))
        .replace(/\\/ig, "/").replace(/\/\/\//g, "/").replace(/\/\//g, "/");
};
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
    return !/\.ico$/.test(url) && !(/^http[s]:\/\//.test(url));
};
const getAbsoluteUrl = (url, rootDir = './') => {
    const abs = getAbsoutePath(rootDir);
    if (!url) {
        return abs;
    }
    url = decodeURIComponent(handlerUrl(url));
    if (url.indexOf(abs) !== -1) {
        return url.indexOf(abs) !== -1 ? url : path__namespace.join(abs, url);
    }
    else {
        return path__namespace.join(abs, url == '' ? '' : url);
    }
};
const ignoreBaseUrl = (url, ingoreBase) => {
    if (!ingoreBase || ingoreBase == '/') {
        return url;
    }
    if (Array.isArray(ingoreBase)) {
        for (let i = 0; i < ingoreBase.length; i++) {
            if (url.indexOf(ingoreBase[i]) !== -1) {
                url = url.replace(ingoreBase[i], '');
            }
        }
    }
    else if (url.indexOf(ingoreBase) !== -1) {
        url = url.replace(ingoreBase, '');
    }
    return url;
};
const baseUrl = (url, baseUrl) => {
    if (!baseUrl || baseUrl == '/') {
        return url;
    }
    return `${baseUrl}/${url}`;
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
const getAbsoutePath = (rootDir) => {
    if (rootDir.startsWith('/')) {
        return rootDir;
    }
    if (/^.:/.test(rootDir)) {
        return rootDir;
    }
    return rootDir.indexOf(path__namespace.join(__dirname, rootDir)) !== -1 ? rootDir : path__namespace.join(__dirname, rootDir);
};
const curReadFolder = (folderPath = getAbsoutePath(''), cache, isParse = false) => {
    let config = cache.get(CACHE_COMMAND_KEY);
    let temp = '';
    const p = isParse ? folderPath : getAbsoluteUrl(folderPath, config.root);
    let reqUrl = folderPath === getAbsoluteUrl(config.root) ? '/' : decodeURIComponent(getRequestUrl(folderPath, config.root));
    let readContent = '';
    if (config.single) {
        const i = createIndexHtml(getAbsoutePath(config.root), config);
        if (fs__namespace.existsSync(i)) {
            readContent = fs__namespace.readFileSync(i);
        }
        else {
            colorUtils.error(`place check ${config.index} exist ?`);
        }
    }
    else if (config.parseIndex && fs__namespace.existsSync(createIndexHtml(p))) {
        readContent = fs__namespace.readFileSync(createIndexHtml(p));
    }
    else {
        const files = fs__namespace.readdirSync(folderPath);
        for (let i = 0; i < files.length; i++) {
            try {
                const file = getAbsoluteUrl(files[i], config.root);
                let this_url = getRequestUrl(file, config.root);
                let isDirectory = fs__namespace.statSync(file).isDirectory();
                temp += getTagStr(this_url, isDirectory);
            }
            catch (error) {
                colorUtils.error(`curReadFolder  error: ${error}`);
                errorLog(error);
            }
        }
        let title = path__namespace.basename(reqUrl) === '/' || path__namespace.basename(reqUrl) === '' ? '首页' : path__namespace.basename(reqUrl);
        readContent = Template
            .replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
            .replace(/<div class="container">(.*?)<\/div>/, `<div class="container">${temp}</div>`);
    }
    cache.set(reqUrl, new Page(reqUrl, readContent, true));
    return readContent;
};
const colorUtils = {
    'success': function (...args) {
        console.log(CustomColor.fontColor(66, 211, 146, args));
    },
    'error': function (...args) {
        console.log(CustomColor.fontColor(247, 78, 30, args));
    },
    'warning': function (...args) {
        console.log(CustomColor.fontColor(255, 185, 0, args));
    },
    'background': function (R, G, L, ...args) {
        console.log(CustomColor.fontColor(66, 211, 146, args));
    },
    'custom': function (background, fontColor, ...args) {
        console.log(CustomColor.backgroundAndFontColor(background.R, background.G, background.L, fontColor.R, fontColor.G, fontColor.L, args));
    }
};

const createCommand = () => {
    let obj = {};
    for (let k in config) {
        obj[k] = `--${k}`;
    }
    return obj;
};
const initCommand = createCommand();
const parseHelpCommand = () => {
    const helpContent = `
    node ${path__namespace$1.basename(__filename)} [command] \n
    command list: \n
        command                description
        ===============================================================================================
        --help                 command Description 
        --port                 specify the startup port number default 8080,use -p=3000 
        --index                is it directly mapped to index.html? if it exists ,default false ,use -index=about.html 📗
        --parse                folder current html as main ,default every folder index.html ,if you want to custom, please use -index=custom.html !📗
        --root                 directly start open folder default current ,if you want ot use dist ,use -r=dist
        --time                 content refresh time default 3000 ,use -t=100 
        --watch                listener file update  default false use --w
        --open                 start open default browser ,if you want close ,please use -o=false 
        --u                    open a web page ,default my blog about this content ,-u=url 
        --single               if your page is single please use -s,default false 
        --logo                 print logo , default true , -l=false close logo
        --errorPage            custom 404 page !use --404=404.index.html
        --ignoreBase           ignore path , default no any!
        --base                 access url auto base
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
        colorUtils.warning('defaultValue is undefined');
    }
    if (!arg) {
        colorUtils.warning('arg is null or undefined');
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
                colorUtils.warning(`${arg} args should like key=value use default ${defaultValue}`);
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
    let time = config.time;
    if (includeCommand(initCommand['time'])) {
        try {
            time = Number(parseCommandArgs(initCommand['time'], 3000));
            if (isNaN(time)) {
                console.warn('refreshTime must be a number  use default 3000!');
                time = config.time;
            }
            if (time <= 1000) {
                console.warn('refreshTime min should >=1000');
                time = 1000;
            }
        }
        catch (error) {
            console.log(`${initCommand['time']} command is parse fail ,${error}`);
            time = config.time;
        }
    }
    return time;
};
const parsePortCommand = () => {
    let p = config.port;
    if (includeCommand(initCommand['port'])) {
        try {
            p = parseInt(parseCommandArgs(initCommand['port'], config.port));
            if (p <= 1) {
                console.log(`port can not ${p} `);
                p = config.port;
            }
        }
        catch (error) {
            p = config.port;
            console.log(`${initCommand['port']} command is parse fail,because ${error}`);
        }
    }
    return p;
};
const parseRootCommand = () => {
    let d = config.root;
    if (includeCommand(initCommand['root'])) {
        d = parseCommandArgs(initCommand['root'], d);
        const f = getAbsoutePath(d);
        if (d !== config.root) {
            if (!fs__namespace.existsSync(f) || !fs__namespace.statSync(f).isDirectory()) {
                throw new Error(`folder ${f} not exist ,please check!`);
            }
        }
    }
    return d;
};
const parseFileCommand = (curr, commandStr, fileName) => {
    if (!fileName) {
        return fileName;
    }
    let file;
    if (includeCommand(commandStr)) {
        let i = parseCommandArgs(commandStr, fileName);
        file = path__namespace$1.join(getAbsoutePath(curr), i);
        if (!fs__namespace.existsSync(file)) {
            colorUtils.error(`parse file error ${file}`);
        }
    }
    return fileName;
};
const parseCommand = () => {
    var _a;
    console.log('初始命令:', initCommand);
    let currDirctory = parseRootCommand();
    let directIndexHtmlFile = (_a = parseFileCommand(currDirctory, initCommand['index'], 'index.html')) !== null && _a !== void 0 ? _a : 'index.html';
    let errorPath = parseFileCommand(currDirctory, initCommand['errorPage'], '');
    let errorPage = { path: errorPath, code: [404, 500] };
    let port = parsePortCommand();
    let time = parseTimeCommand();
    let isParseInndex = parseStringOrBoolCommand(initCommand['parseIndex'], config.parseIndex);
    let single = !!parseFileCommand(currDirctory, initCommand['single'], config.root);
    let isOpen1 = parseStringOrBoolCommand(initCommand['open'], config.open);
    let watch = parseStringOrBoolCommand(initCommand['watch'], config.watch);
    let isPrintLogo1 = parseStringOrBoolCommand(initCommand['logo'], config.logo);
    let base = parseStringOrBoolCommand(initCommand['base'], config.base);
    let ignoreBase = parseStringOrBoolCommand(initCommand['ignoreBase'], config.ignoreBase);
    let serverConfig = {
        'port': port,
        'base': base,
        'ignoreBase': ignoreBase,
        'index': directIndexHtmlFile,
        'root': currDirctory,
        'parseIndex': isParseInndex,
        'single': single,
        'open': isOpen1,
        'time': time,
        'watch': watch,
        'logo': isPrintLogo1,
        'errorPage': errorPage
    };
    console.log('======================基础信息==================');
    console.log('端口号', serverConfig.port);
    console.log('前缀', serverConfig.base);
    console.log('忽略前缀', serverConfig.ignoreBase);
    console.log('是否解析index.html', serverConfig.parseIndex);
    console.log('index.html = >', serverConfig.index);
    console.log('是否是单文件应用', serverConfig.single);
    console.log('是否打开默认浏览器', serverConfig.open);
    console.log('是否监视文件', serverConfig.watch, '监视时间', serverConfig.time);
    console.log('是否打印logo', serverConfig.logo);
    return serverConfig;
};

const handlerBaseMiddware = (request, response) => {
    let url = decodeURIComponent(handlerUrl(request.url));
    url = ignoreBaseUrl(url, serverConfig.ignoreBase);
    url = baseUrl(url, serverConfig.base);
    request.url = url;
};

const middwares = [
    handlerBaseMiddware
];
const handlerMiddware = (request, response) => {
    try {
        if (request.url.startsWith('http')) {
            return;
        }
        for (let i = 0; i < middwares.length; i++) {
            const middware = middwares[i];
            middware(request, response);
        }
    }
    catch (error) {
        colorUtils.error(`middware handler error ${error}`);
    }
};

const logo = `
#    # #    #       #      # #    # ######        ####  ###### #####  #    # ###### #####  
#    #  #  #        #      # #    # #            #      #      #    # #    # #      #    # 
#    #   ##   ##### #      # #    # #####  #####  ####  #####  #    # #    # #####  #    # 
# ## #   ##         #      # #    # #                 # #      #####  #    # #      #####  
##  ##  #  #        #      #  #  #  #            #    # #      #   #   #  #  #      #   #  
#    # #    #       ###### #   ##   ######        ####  ###### #    #   ##   ###### #    # 
`;

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
    if (!(page === null || page === void 0 ? void 0 : page.pageUrl) || !(page === null || page === void 0 ? void 0 : page.content) || !(page === null || page === void 0 ? void 0 : page.contentType)) {
        return;
    }
    let pageUrl = page.pageUrl;
    if (FileNotFounds.indexOf(pageUrl) !== -1) {
        return;
    }
    let real_url = getAbsoluteUrl(pageUrl, childWorkCommand.root);
    console.log('child watch file change info watch url =', real_url);
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
const childWorkerRun = (cmd, time = 2000, pageCache) => {
    const childWorker = new worker_threads.Worker(__filename);
    setInterval(() => {
        childWorker.postMessage(pageCache);
    }, time);
    childWorker.on('message', message => {
        cacheUpdate(message, pageCache);
    });
};

const allReqUrl = [];
const MAX_PAGE_SIZE = 100;
const NotFoundPageUrl = [];
const pageCache = new LRUCache(MAX_PAGE_SIZE);
const NOT_FOUND_PAGE = new Page("404.html", NotFound, true);
const hostname = '127.0.0.1';
let count = 0;
let serverConfig = null;
let defaultMyContent = 'https://wuxin0011.github.io/tools/node-live-serve/';
const cors = (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
};
const server = http__namespace.createServer((request, response) => {
    cors(request, response);
    handlerMiddware(request, response);
    let url = request.url;
    if (NotFoundPageUrl.indexOf(url) !== -1) {
        colorUtils.error(`访问路径不存在！:${url} 对应真实文件路径： ${getAbsoluteUrl(url, serverConfig.root)}`);
        responseTemplate(request, response, NOT_FOUND_PAGE);
        return;
    }
    if (isAllowResolve(url)) {
        responseContent(request, response);
    }
});
const responseContent = (request, response) => {
    let url = request.url;
    let real_url = getAbsoluteUrl(url, serverConfig.root);
    if (!fs__namespace.existsSync(real_url)) {
        if (!serverConfig.single) {
            responseErrorPage(request, response, "请求内容不存在");
        }
        NotFoundPageUrl.push(url);
        return;
    }
    try {
        const status = fs__namespace.statSync(real_url);
        if (getExt(url) === unknownFile) {
            if (status.isDirectory() && (serverConfig.parseIndex) || serverConfig.single) {
                const indexHtml = createIndexHtml(real_url, serverConfig);
                if (fs__namespace.existsSync(indexHtml)) {
                    let content = readFile(indexHtml);
                    const this_page = new Page(url, content, false);
                    responseTemplate(request, response, this_page);
                    allReqUrl.push(url);
                    pageCache.set(url, this_page);
                }
            }
            return;
        }
        if (status.isDirectory()) {
            curReadFolder(real_url, pageCache.cache);
            const page = pageCache.get(url);
            responseTemplate(request, response, page !== -1 ? page : NOT_FOUND_PAGE);
        }
        else {
            const content = readFile(real_url);
            if (!content) {
                if (!serverConfig.single) {
                    responseErrorPage(request, response, "请求内容不存在");
                    NotFoundPageUrl.push(url);
                }
            }
            else {
                const page = new Page(url, content, false);
                pageCache.set(url, page);
                allReqUrl.push(url);
                responseTemplate(request, response, page);
            }
        }
    }
    catch (error) {
        colorUtils.error(`响应失败：${error}`);
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
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Content-Type', serverConfig.single && (page.pageUrl === '/' || page.pageUrl === '') ? 'text/html;charset=utf-8' : page.contentType);
        response.write(page.content);
        response.end();
    }
    catch (error) {
        colorUtils.error(`response error:${error}`);
    }
};
const openWebPage = (url) => {
    let runCommand = '';
    let isInitSystemCommand = false;
    if (!isInitSystemCommand) {
        if (isWindow()) {
            runCommand = 'start';
            isInitSystemCommand = true;
        }
        else if (isMac()) {
            runCommand = 'open';
            isInitSystemCommand = true;
        }
        else {
            isInitSystemCommand = false;
        }
    }
    if (isInitSystemCommand) {
        child_process.exec(`${runCommand} ${url}`, (error, stdout, stderr) => {
            if (error) {
                colorUtils.error(`浏览器打开失败！错误详情: ${error}`);
                errorLog(error);
                return;
            }
            if (stderr) {
                colorUtils.error(`浏览器打开失败！错误详情: ${stderr}`);
                errorLog(error);
                return;
            }
        });
    }
    else {
        colorUtils.warning('当前环境不支持打开默认浏览器 请手动打开！');
    }
    if (serverConfig.logo) {
        colorUtils.success(logo);
    }
    colorUtils.success(`live-server 启动成功！点击访问 ${url}`);
};
const saveConfig = (config, cache) => {
    if (!config) {
        throw new Error('config init error !');
    }
    cache.set(CACHE_COMMAND_KEY, config);
};
const run = () => {
    let firstStart = true;
    const start = (error) => {
        if (count < 20) {
            if (!firstStart) {
                serverConfig.port += 1;
                count += 1;
            }
            try {
                server.listen({
                    host: hostname,
                    port: serverConfig.port
                }, () => {
                    curReadFolder(getAbsoluteUrl('', serverConfig.root), pageCache.cache, false);
                    if (serverConfig.open) {
                        openWebPage(`http://${hostname}:${serverConfig.port}`);
                    }
                    if (serverConfig.watch) {
                        childWorkerRun(serverConfig, serverConfig.time, pageCache);
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
            colorUtils.error('启动失败:', error);
            server.close();
            errorLog(error);
        }
    };
    try {
        if (includeCommand('--help') || includeCommand('help')) {
            parseHelpCommand();
        }
        else if (includeCommand(initCommand.open)) {
            const url = parseCommandArgs(initCommand.open, defaultMyContent);
            openWebPage(url);
        }
        else {
            serverConfig = parseCommand();
            saveConfig(serverConfig, pageCache);
            start(null);
        }
    }
    catch (e) {
        colorUtils.error(`启动失败：${e}`);
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
