import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class RoomAlreadyStartedException extends Exception {
  static status = 409
  static code = 'E_ROOM_ALREADY_STARTED'
  static message = 'Room already started'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  static body() {
    return { message: this.message, code: this.code }
  }
}
