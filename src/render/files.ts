

export const unknownFile = 'unknown'


import filetypes from './match-file';


const hasExt = (file: string) => getExt(file) === unknownFile


export const getExt = (file: string) => {
  if (file.indexOf('.') !== -1) {
    let s = file.split('.') as string[]
    // return last!
    return s[s.length - 1]
  } else {
    return unknownFile
  }
}


const getClassFileName = (className: string) => `${className}-file`


export const getClassName = (url: string | undefined) => {
  if (!url) {
    return getClassFileName(unknownFile)
  }
  for (let i = 0; i < filetypes.length; i++) {
    const ext = filetypes[i].ext
    const className = filetypes[i].className
    if (ext instanceof RegExp && ext.test(url)) {
      return getClassFileName(className)
    } else {
      if (ext instanceof String) {
        // 判断文件后缀
        const e = getExt(url)
        if (e === unknownFile) {
          return getClassFileName(unknownFile)
        }
        if (ext.indexOf(e) !== -1) {
          return getClassFileName(className)
        }
      }
    }
  }

  return getClassFileName(unknownFile)
}




export const getIconBeforeClass = () => {
  let t = ''
  for (let i = 0; i < filetypes.length; i++) {
    let str = ''
    const icon = filetypes[i]?.icon
    const fileClassName = getClassFileName(filetypes[i].className)
    str = `.${fileClassName}::before`
    str = str + `{
        content:"${icon?.content ?? '🎈'}";
        width:${icon?.width ?? 10}px;
        height:${icon?.height ?? 10}px;
      }\n\n`
    t += str;
  }
  return t
}


