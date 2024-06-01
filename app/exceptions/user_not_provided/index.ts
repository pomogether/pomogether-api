import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UserNotProvidedException extends Exception {
  static status = 422
  static code = 'E_USER_NOT_PROVIDED'
  static message = 'The user was not provided'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  body() {
    return { message: this.message, code: this.code }
  }
}
