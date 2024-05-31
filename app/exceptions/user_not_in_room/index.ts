import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UserNotInRoomException extends Exception {
  static status = 404
  static code = 'E_USER_NOT_IN_ROOM'
  static message = 'User not in room'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  body() {
    return { message: this.message, code: this.code }
  }
}
