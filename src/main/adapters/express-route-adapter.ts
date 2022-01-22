import { Request, RequestHandler, Response } from 'express'

import { Controller, HttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: Controller): RequestHandler => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const { statusCode, body } = await controller.handle(httpRequest)

    response.status(statusCode).json(body)
  }
}
