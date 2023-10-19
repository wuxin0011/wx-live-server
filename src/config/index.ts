
import { ServerConfig } from "../../types/index";



/**
 * 默认配置信息
 */
const config: ServerConfig = {
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
}


export default config
