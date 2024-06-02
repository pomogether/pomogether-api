import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class RoomNotStartedYetException extends Exception {
  static status = 409
  static code = 'E_ROOM_NOT_STARTED_YET'
  static message = 'Room not started yet'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send({ message: error.message, code: error.code })
  }

  body() {
    return { message: this.message, code: this.code }
  }
}
