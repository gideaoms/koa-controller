import { Context, Next } from 'koa'

declare module 'koa' {
  interface Response {
    json: (body: any) => void

    code: (status: number) => ({
      json: (body: any) => void
    })
  }
}

const responder = async ({ response }: Context, next: Next) => {
  response.json = (body) => {
    response.body = body
  }

  response.code = (status) => {
    response.status = status
    return {
      json: response.json
    }
  }

  const body = await next()

  if (!response.body) {
    response.body = body
  }
}

export default responder
