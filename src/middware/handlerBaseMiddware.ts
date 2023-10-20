
import type { IncomingMessage, ServerResponse } from 'node:http'
import { handlerUrl, ignoreBaseUrl } from '../utils/utils'
import { serverConfig } from '../main'
import { baseUrl } from '../utils/utils'



const handlerBaseMiddware = (request: IncomingMessage, response: ServerResponse) => {
  let url = decodeURIComponent(handlerUrl(request.url))
  url = ignoreBaseUrl(url, serverConfig.ignoreBase)
  url = baseUrl(url, serverConfig.base)
  request.url = url
}


export default handlerBaseMiddware
