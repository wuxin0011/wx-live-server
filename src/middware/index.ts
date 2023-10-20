
import type { IncomingMessage, ServerResponse } from 'node:http'

import handlerBaseMiddware from './handlerBaseMiddware'
import { colorUtils } from '../utils/utils'

interface Middware {
  (request: IncomingMessage, response: ServerResponse): void
}


// 注册中间件
const middwares = [
  handlerBaseMiddware
]



const handlerMiddware = (request: IncomingMessage, response: ServerResponse) => {
  try {

    // ingore 
    if (request.url.startsWith('http')) {
      return;
    }
    for (let i = 0; i < middwares.length; i++) {
      const middware = middwares[i]
      middware(request, response)
    }
  } catch (error) {
    colorUtils.error(`middware handler error ${error}`)
  }

}



export default handlerMiddware
