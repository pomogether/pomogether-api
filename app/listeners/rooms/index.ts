import RoomNotFoundException from '#exceptions/room_not_found'
import UserAlreadyInRoomException from '#exceptions/user_already_in_room'
import UserNotFoundException from '#exceptions/user_not_found'
import RoomsService from '#services/rooms'
import { handleErrorWrapper } from '#utils'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import { RoomsEvents } from '@pomogether/commons/events'

type OnUserJoinData = {
  roomId: string
  userId: string
}

export default class RoomsListerns {
  static async onUserJoin<T extends OnUserJoinData>(data: T): Promise<void> {
    const roomsService = await app.container.make(RoomsService)

    const error = await handleErrorWrapper<UserAlreadyInRoomException | RoomNotFoundException>(
      async () => roomsService.joinRoom(data.roomId, data.userId)
    )

    // TODO: melhorar esse if, tentar criar uma funcão como isException(error, ExceptionType)
    if (error instanceof RoomNotFoundException || error instanceof UserNotFoundException) {
      redis.publish(RoomsEvents.LEAVE, JSON.stringify(error.body()))
      logger.warn(
        `User "${data.userId}" could not join in room "${data.roomId}": ${JSON.stringify(error.body())}`
      )
    }
  }
}
