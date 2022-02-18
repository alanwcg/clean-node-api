import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpRequest, HttpResponse } from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const authHeader = httpRequest.headers?.Authorization

    if (authHeader) {
      const [, accessToken] = authHeader.split(' ')
      await this.loadAccountByToken.load(accessToken)
    }

    return forbidden(new AccessDeniedError())
  }
}
