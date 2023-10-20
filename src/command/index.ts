import * as fs from 'node:fs'
import * as path from 'path'
import { ErrorPage, ServerConfig } from '../../types/index'
import config from '../config/index'
import { colorUtils, getAbsoutePath } from '../utils/utils'



const createCommand = (): Record<keyof ServerConfig, string> => {
    let obj = {}
    for (let k in config) {
        obj[k] = `--${k}`
    }
    return obj as Record<keyof ServerConfig, string>
}

export const initCommand = createCommand()




export const parseHelpCommand = () => {
    const helpContent = `
    node ${path.basename(__filename)} [command] \n
    command list: \n
        command                description
        ===============================================================================================
        --help                 command Description 
        --port                 specify the startup port number default 8080,use --port=3000 
        --base                 add access url,use --base=customurl 
        --ignoreBase           ignore path , default no any!,use --ingoreBase=customurl
        --index                is it directly mapped to index.html? if it exists ,default false  ,use --parseIndex=true
        --parse                folder current html as main ,default every folder index.html ,if you want to custom, please use --index=custom.html !
        --root                 directly start open folder default current ,if you want ot use dist ,use --root=dist
        --time                 content refresh time default 3000 ,use --time=100 
        --watch                listener file update  default false use --watch=false
        --open                 start open default browser ,if you want close ,please use --open=false 
        --url                  open a web page ,default my blog about this content ,--url=url 
        --single               if your page is single please use --single,default false 
        --logo                 print logo , default true , --logo=false close logo
        --errorPage            custom 404 page !use --404=404.index.html

    `
    colorUtils['success'](helpContent)
}

export const includeCommand = (arg: string) => {
    if (!arg) {
        return false
    }
    return process.argv.slice(2).findIndex(param => param.indexOf(arg) !== -1) !== -1
}


export const parseCommandArgs = (arg: string, defaultValue: unknown) => {
    if (defaultValue === undefined) {
        colorUtils.warning('defaultValue is undefined')
    }
    if (!arg) {
        colorUtils.warning('arg is null or undefined')
        return defaultValue
    }
    const args = process.argv.slice(2)
    for (let i = 0; i < args.length; i++) {
        const param = args[i]
        if (param.indexOf(arg) !== -1) {
            if (param.indexOf('=') !== -1) {
                let s = param.split('=')
                return s[s.length - 1]
            } else {
                colorUtils.warning(`${arg} args should like key=value use default ${defaultValue}`)
                return defaultValue
            }
        }
    }
    return defaultValue
}





const parseStringOrBoolCommand = (commandArg: string, defaultValue: string | boolean) => {
    console.log('command', commandArg)
    let result = defaultValue
    if (includeCommand(commandArg)) {
        result = parseCommandArgs(commandArg, defaultValue) as typeof defaultValue
        if (commandArg === '--ignoreBase') {
            console.log('result', result)
        }
    }
    return result
}


const parseTimeCommand = () => {
    let time = config.time
    if (includeCommand(initCommand['time'])) {
        try {
            time = Number(parseCommandArgs(initCommand['time'], 3000))
            if (isNaN(time)) {
                console.warn('refreshTime must be a number  use default 3000!')
                time = config.time
            }
            if (time <= 1000) {
                console.warn('refreshTime min should >=1000')
                time = 1000
            }
        } catch (error) {
            console.log(`${initCommand['time']} command is parse fail ,${error}`)
            time = config.time
        }
    }
    return time
}


const parsePortCommand = () => {
    let p = config.port
    if (includeCommand(initCommand['port'])) {
        try {
            p = parseInt(parseCommandArgs(initCommand['port'], config.port) as string)
            if (p <= 1) {
                console.log(`port can not ${p} `)
                p = config.port
            }
        } catch (error) {
            p = config.port
            console.log(`${initCommand['port']} command is parse fail,because ${error}`)
        }
    }
    return p
}



const parseRootCommand = () => {
    let d = config.root
    if (includeCommand(initCommand['root'])) {
        d = parseCommandArgs(initCommand['root'], d) as string
        const f = getAbsoutePath(d)
        if (d !== config.root) {
            // check folder exist ?
            if (!fs.existsSync(f) || !fs.statSync(f).isDirectory()) {
                throw new Error(`folder ${f} not exist ,please check!`)
            }
        }
    }
    return d
}

const parseFileCommand = (curr: string, commandStr: string, fileName: string) => {
    if (!fileName) {
        // colorUtils.error(`${fileName} is not allowed null or undefined`)
        return fileName;
    }
    let file: string
    if (includeCommand(commandStr)) {
        let i = parseCommandArgs(commandStr, fileName) as string
        file = path.join(getAbsoutePath(curr), i)
        // check 
        if (!fs.existsSync(file)) {
            colorUtils.error(`parse file error ${file}`)
        }
    }
    return fileName
}



export const parseCommand = () => {


    console.log('初始命令:', initCommand)

    let currDirctory = parseRootCommand()
    let directIndexHtmlFile = parseFileCommand(currDirctory, initCommand['index'], 'index.html') ?? 'index.html'
    let errorPath = parseFileCommand(currDirctory, initCommand['errorPage'], '') as string
    let errorPage: ErrorPage = { path: errorPath, code: [404, 500] }
    let port = parsePortCommand()
    let time = parseTimeCommand()
    let isParseInndex = parseStringOrBoolCommand(initCommand['parseIndex'], config.parseIndex) as boolean
    let single = !!parseFileCommand(currDirctory, initCommand['single'], config.root)
    let isOpen1 = parseStringOrBoolCommand(initCommand['open'], config.open) as boolean
    let watch = parseStringOrBoolCommand(initCommand['watch'], config.watch) as boolean
    let isPrintLogo1 = parseStringOrBoolCommand(initCommand['logo'], config.logo) as boolean
    let base = parseStringOrBoolCommand(initCommand['base'], config.base) as string
    let ignoreBase = parseStringOrBoolCommand(initCommand['ignoreBase'], config.ignoreBase as string) as string


    let serverConfig: ServerConfig = {
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
    }
    console.log('======================基础信息==================')
    console.log('端口号', serverConfig.port)
    console.log('前缀', serverConfig.base)
    console.log('忽略前缀', serverConfig.ignoreBase)
    console.log('是否解析index.html', serverConfig.parseIndex)
    console.log('index.html = >', serverConfig.index)
    console.log('是否是单文件应用', serverConfig.single)
    console.log('是否打开默认浏览器', serverConfig.open)
    console.log('是否监视文件', serverConfig.watch, '监视时间', serverConfig.time)
    console.log('是否打印logo', serverConfig.logo)
    return serverConfig
}
