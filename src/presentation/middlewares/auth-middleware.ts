import { AccessDeniedError } from '../errors'
import { forbidden, serverError, success } from '../helpers/http/http-helper'
import {
  Middleware,
  HttpRequest,
  HttpResponse,
  LoadAccountByToken
} from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const authHeader = httpRequest.headers?.authorization

      if (authHeader) {
        const [, accessToken] = authHeader.split(' ')

        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return success({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
