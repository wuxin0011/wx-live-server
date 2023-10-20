export { }

export interface Icon {
  content?: string,
  width?: number
  height?: number
}

export interface FileType {
  className: string
  ext: string[] | RegExp,
  icon?: Icon
}

export interface ErrorPage {
  path: string
  code: number | number[]
}


export interface ServerConfig {
  /**
   * 前缀
   * 给访问路径添加前缀
   * example --base=/server
   */
  base?: string

  /**
   * 忽略前缀
   * 
   * example: 如果要忽略 xxxxx/hello/index.html 中 xxxxx/hello 请用 --ignorebase=xxxxx/hello
   */
  ignoreBase?: string | string[]

  /**
   * 端口号 默认是 8000
   * example --port=8888 or -p=8888
   */
  port?: number


  /**
   * 解析 index.html 默认不解析 如果是单文件请设置 解析 
   */
  index?: string

  /**
   * 是否开启解析目录文件夹中解析的指定 .html 文件 ，默认你是 index.html 
   */
  parseIndex?: boolean


  /**
   * 是否是单文件
   */
  single?: boolean


  /**
   * 根路径 默认解析启动的路径文件 如果需要指定其他文件路径 请输入文件路径 
   * example      --root=D://desktop//single
   */
  root?: string



  /**
   * 文件监听时间
   * example -t=1000 or --time=1000
   */
  time?: number


  /**
   * 是否监听文件改变 默认不监听文件改变
   * example 启用请用 命令 --watch
   */
  watch?: boolean


  /**
   * 是否自动打开默认浏览器 默认true
   * example --open 关闭
   */
  open?: boolean


  /**
   * 是否输出logo 默认true
   * example --logo
   */
  logo?: boolean


  /**
   * 忽略的文件
   */
  ignoreFile?: string | string[]


  /**
   * 配置错误文件路径信息
   * 暂时不支持!!!
   */
  errorPage?: ErrorPage
}




