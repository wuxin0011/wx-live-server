import * as path from 'path'
import * as fs from 'node:fs'
import { colorUtils, getAbsoutePath } from '../utils/utils'
import {
    indexHtml,
    isOpen,
    isParseIndexHtml,
    isSingle,
    isWatch,
    port,
    refreshTime,
    rootFolder,
    isPrintLogo
} from '../main'


interface ErrorPage {
    errorPath?: string
}


export class Command {
    port: number
    index: string
    isParseIndex: boolean
    single: boolean
    root: string
    time: number
    watch: boolean
    open: boolean
    logo: boolean
    NotFoundErrorPage: ErrorPage
    constructor(
        p: number = port,
        i: string = indexHtml,
        isIndex: boolean = isParseIndexHtml,
        r: string = rootFolder,
        s: boolean = isSingle,
        o: boolean = isOpen,
        t: number = refreshTime,
        w: boolean = isWatch,
        l: boolean = isPrintLogo,
        error_404: ErrorPage = { errorPath: '' }
    ) {
        this.port = p
        this.index = i
        this.isParseIndex = isIndex
        this.root = r
        this.single = s
        this.time = t
        this.open = o
        this.watch = w
        this.logo = l
        this.NotFoundErrorPage = error_404
    }
}


export const helpCommand = '-h'
export const indexCommand = '-index'
export const isParseIndexCommand = '-i'
export const openCommand = '-o'
export const openUrlCommand = '-u'
export const portCommand = '-p'
export const watchCommand = '-w'
export const singlePageCommand = '-s'
export const rootCommand = '-r'
export const refreshCommand = '-t'
export const logoCommand = '-l'
export const notFoundCommand = '--404'
export const parseHelpCommand = () => {
    const helpContent = `
    node ${path.basename(__filename)} [command] \n
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
        --404              custom 404 page !use --404=404.index.html
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


const parseIndexHtmlCommand = () => {
    let indexPage = indexHtml
    if (includeCommand(indexCommand)) {
        indexPage = parseCommandArgs(indexCommand, indexHtml) as string
    }
    return indexPage
}


const parseStringOrBoolCommand = (commandArg: string, defaultValue: string | boolean) => {
    let result = defaultValue
    if (includeCommand(commandArg)) {
        result = parseCommandArgs(commandArg, defaultValue) as typeof defaultValue
    }
    return result
}


const parseTimeCommand = () => {
    let time = refreshTime
    if (includeCommand(refreshCommand)) {
        try {
            time = Number(parseCommandArgs(refreshCommand, 3000))
            if (isNaN(time)) {
                console.warn('refreshTime must be a number  use default 3000!')
                time = refreshTime
            }
            if (time <= 1000) {
                console.warn('refreshTime min should >=1000')
                time = 1000
            }
        } catch (error) {
            console.log(`${refreshCommand} command is parse fail ,${error}`)
            time = refreshTime
        }
    }
    return time
}


const parsePortCommand = () => {
    let p = port
    if (includeCommand(portCommand)) {
        try {
            p = parseInt(parseCommandArgs(portCommand, port) as string)
            if (p <= 1) {
                console.log(`port can not ${p} `)
                p = port
            }
        } catch (error) {
            p = port
            console.log(`${portCommand} command is parse fail,because ${error}`)
        }
    }
    return p
}



const parseRootCommand = () => {
    let d = rootFolder
    if (includeCommand(rootCommand)) {
        d = parseCommandArgs(rootCommand, d) as string
        const f = getAbsoutePath(d)
        if (d !== rootFolder) {
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
        colorUtils.error(`${fileName} is not allowed null or undefined`)
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
    let currDirctory = parseRootCommand()
    let directIndexHtmlFile = parseFileCommand(currDirctory, indexCommand, 'index.html') ?? 'index.html'
    let errorPath = parseFileCommand(currDirctory, notFoundCommand, '') as string
    let errorPage = { errorPath: errorPath } as ErrorPage
    let port = parsePortCommand()
    let time = parseTimeCommand()
    let isParseInndex = parseStringOrBoolCommand(isParseIndexCommand, isParseIndexHtml) as boolean
    let single = !!parseFileCommand(currDirctory, singlePageCommand, directIndexHtmlFile)
    let isOpen1 = parseStringOrBoolCommand(openCommand, isOpen) as boolean
    let watch = parseStringOrBoolCommand(watchCommand, isWatch) as boolean
    let isPrintLogo1 = parseStringOrBoolCommand(logoCommand, isPrintLogo) as boolean


    let cmd = new Command(
        port,
        directIndexHtmlFile,
        isParseInndex,
        currDirctory,
        single,
        isOpen1,
        time,
        watch,
        isPrintLogo1,
        errorPage
    )

    console.log('init command info ...', cmd)

    return cmd
}
