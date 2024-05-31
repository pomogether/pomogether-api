import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UserNotFoundException extends Exception {
  static status = 404
  static code = 'E_USER_NOT_FOUND'
  static message = 'User not found'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  body() {
    return { message: this.message, code: this.code }
  }
}
