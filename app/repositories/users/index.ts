import Room from '#models/room'
import User from '#models/user'

export default class UsersRepository {
  async findOne(id: string) {
    return User.find(id)
  }

  async joinRoom(room: Room, user: User) {
    return await user.related('room').associate(room)
  }

  async leaveRoom(user: User) {
    return await user.related('room').dissociate()
  }
}
