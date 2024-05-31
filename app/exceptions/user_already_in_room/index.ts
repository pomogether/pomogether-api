import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UserAlreadyInRoomException extends Exception {
  static status = 409
  static code = 'E_USER_ALREADY_IN_ROOM'
  static message = 'User already in room'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  body() {
    return { message: this.message, code: this.code }
  }
}
