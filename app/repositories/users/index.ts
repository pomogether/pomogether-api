import Room from '#models/room'
import User from '#models/user'

export default class UsersRepository {
  async findUserByRoom(id: string, room: Room) {
    return User.query().where('id', id).where('room_id', room.id).first()
  }

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
