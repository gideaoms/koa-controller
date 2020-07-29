import { Context, Next } from 'koa'
import { Boom } from '@hapi/boom'

const messenger = async ({ response }: Context, next: Next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof Boom) {
      response.status = error.output.statusCode
      response.body = {
        message: error.output.payload.message
      }
    } else {
      throw error
    }
  }
}

export default messenger
