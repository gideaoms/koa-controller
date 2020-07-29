import { Middleware } from 'koa'
import compose from 'koa-compose'
import { ObjectSchema } from '@hapi/joi'
import catcher from 'koa-catcher'
import responder from './responder'
import validator from './validator'
import messenger from './messenger'

type Opts = {
  validate?: {
    body?: ObjectSchema
    query?: ObjectSchema
    params?: ObjectSchema
  }
  middlewares?: Middleware[]
  debug?: boolean
  handler: Middleware,
}

const controller = ({ debug = false, validate, middlewares = [], handler }: Opts) => {
  return compose([
    catcher({ debug }),
    messenger,
    validator('body', validate?.body),
    validator('params', validate?.params),
    validator('query', validate?.query),
    compose(middlewares),
    responder,
    handler
  ])
}

export default controller
