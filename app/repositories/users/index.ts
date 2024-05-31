import Room from '#models/room'
import User from '#models/user'

export default class UsersRepository {
  async findUserByRoom(id: string, roomId: string) {
    const room = await Room.find(roomId)

    return room?.related('users').query().where('user_id', id).first()
  }

  async findOne(id: string) {
    return User.find(id)
  }
}
