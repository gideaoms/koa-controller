import { Context, Next } from 'koa'
import { ValidationError, ObjectSchema } from '@hapi/joi'

type Source = 'body' | 'params' | 'query'

const validator = (source: Source, schema?: ObjectSchema) =>
  async (ctx: Context, next: Next) => {
    try {
      if (!schema) {
        return next()
      }

      const data = {
        body: ctx.body,
        params: ctx.params,
        query: ctx.query
      }
      const { error, value } = schema.validate(data[source] ?? {}, { abortEarly: false })

      if (error) {
        throw error
      }

      ctx[source] = value

      await next()
    } catch (error) {
      if (error instanceof ValidationError) {
        ctx.response.status = 400
        ctx.response.body = {
          messages: error.details.map(({ message, path, type }) =>
            ({ message, path, type }))
        }
      } else {
        throw error
      }
    }
  }

export default validator
