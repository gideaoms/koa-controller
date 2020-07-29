import { Middleware } from 'koa'
import compose from 'koa-compose'
import { ObjectSchema } from '@hapi/joi'
import responder from './responder'
import validator from './validator'

type Opts = {
  validate?: {
    body?: ObjectSchema
    query?: ObjectSchema
    params?: ObjectSchema
  }
  middlewares?: Middleware[]
  handler: Middleware
}

const controller = (opts: Opts) =>
  compose([
    validator('body', opts.validate?.body),
    validator('params', opts.validate?.params),
    validator('query', opts.validate?.query),

    compose(opts.middlewares ?? []),

    responder,

    opts.handler
  ])

export default controller
