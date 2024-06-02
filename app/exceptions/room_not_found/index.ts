import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class RoomNotFoundException extends Exception {
  static status = 404
  static code = 'E_ROOM_NOT_FOUND'
  static message = 'Room not found'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  static body() {
    return { message: this.message, code: this.code }
  }
}
