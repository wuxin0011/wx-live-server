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



