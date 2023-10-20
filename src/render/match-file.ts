import { FileType, Icon } from '../../types/index';


const htmlFile: FileType = {
  ext: /\.(html)$/i,
  className: 'html',
  icon: {
    content: '📘'
  }
}

const txtFile: FileType = {
  ext: /\.(txt|log)$/i,
  className: 'txt',
  icon: {
    content: '📄'
  }
}

const docFile: FileType = {
  ext: /\.(doc|docx)$/i,
  className: 'doc',
  icon: {
    content: '📗'
  }
}

const fontFile: FileType = {
  ext: /\.(ttf|woff|woff2)$/i,
  className: 'font',
  icon: {
    content: '🥦'
  }
}


const videoFile: FileType = {
  ext: /\.(ogg)$/i,
  className: 'video',
  icon: {
    content: '🌎'
  }
}


const musicFile: FileType = {
  ext: /\.(mp3|mp4)$/i,
  className: 'music',
  icon: {
    content: '🎹'
  }
}



const excelFile: FileType = {
  ext: /\.(xlsx|xls)$/i,
  className: 'excel',
  icon: {
    content: '📄'
  }
}




const vueFile: FileType = {
  ext: /\.(vue)$/i,
  className: 'vue',
  icon: {
    content: '🎄'
  }
}

const pythonFile: FileType = {
  ext: /\.(py)$/,
  className: 'python',
  icon: {
    content: '🦎'
  }
}

const goFile: FileType = {
  ext: /\.(go)$/i,
  className: 'go',
  icon: {
    content: '🐹'
  }

}

const rustFile: FileType = {
  ext: /\.(rs)$/i,
  className: 'rust',
  icon: {
    content: '🦏'
  }
}

const swiftFile: FileType = {
  ext: /\.(swift)$/i,
  className: 'swift',
  icon: {
    content: '🐬'
  }
}


const kotlinFile: FileType = {
  ext: /\.(kt)$/i,
  className: 'kotlin',
  icon: {
    content: '🐲'
  }
}


const phpFile: FileType = {
  ext: /\.(php)$/i,
  className: 'php',
  icon: {
    content: '🤖'
  }
}


const perlFile: FileType = {
  ext: /\.(pl)$/i,
  className: 'pl',
  icon: {
    content: '😺'
  }
}

const matlabFile: FileType = {
  ext: /\.(m)$/i,
  className: 'matlab',
  icon: {
    content: '🐻'
  }
}

const luaFile: FileType = {
  ext: /\.(lua)$/i,
  className: 'lua',
  icon: {
    content: '🐟'
  }
}

const cFile: FileType = {
  ext: /\.(c|cpp|h|cc|cxx)$/i,
  className: 'c',
  icon: {
    content: '🐳'
  }
}

const rFile: FileType = {
  ext: /\.(r)$/i,
  className: 'r',
  icon: {
    content: '🦮'
  }
}


const rubyFile: FileType = {
  ext: /\.(rb)$/i,
  className: 'rb',
  icon: {
    content: '🐷'
  }
}

const sqlFile: FileType = {
  ext: /\.(sql|bson|json|dump|bak|ldf|mdf|dmp|dat|idx)$/i,
  className: 'sql',
  icon: {
    content: '🛢'
  }
}

const apkFile: FileType = {
  ext: /\.(apk)$/i,
  className: 'apk',
  icon: {
    content: '📦'
  }
}


const imageFile: FileType = {
  ext: /\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/i,
  className: 'image',
  icon: {
    content: '🔎'
  }
}

const linkFile: FileType = {
  ext: /\.(link|lnk|ink)$/,
  className: 'link',
  icon: {
    content: '🔗'
  }
}

const mdFile: FileType = {
  ext: /\.(md)$/i,
  className: 'markdown',
  icon: {
    content: '⚽'
  }
}

const cssFile: FileType = {
  ext: /\.(css|scss|less)$/i,
  className: 'java',
  icon: {
    content: '🍉'
  }
}
const javaFile: FileType = {
  ext: /\.(java)$/,
  className: 'java',
  icon: {
    content: '💎'
  }
}



const javaClassFile: FileType = {
  ext: /\.(class)$/,
  className: 'class',
  icon: {
    content: '🏀'
  }
}

const jsFile: FileType = {
  ext: /\.(js|jsx)$/,
  className: 'js-jsx',
  icon: {
    content: '🧽'
  }
}

const tsFile: FileType = {
  ext: /\.(ts|tsx)$/,
  className: 'ts-tsx',
  icon: {
    content: '🛹'
  }
}




const configFile: FileType = {
  ext: /\.(ini|conf|cfg|rc|properties|plist|htaccess|cnf|yml|yaml|ddl)$/,
  className: 'config',
  icon: {
    content: '📚'
  }
}

const runFile: FileType = {
  ext: /\.(exe|sh|bat|msi|bin|out|jar)$/,
  className: 'run',
  icon: {
    content: '🚀'
  }
}


// more file 
// ...


const filetypes: FileType[] = [
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
]

export default filetypes

