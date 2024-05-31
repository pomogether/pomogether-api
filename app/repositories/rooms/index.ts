import Room from '#models/room'
import { ModelAttributes } from '@adonisjs/lucid/types/model'

type RoomInserOneValues = Partial<ModelAttributes<Room>> & {
  name: string
  pomodoro: number
  shortBreak: number
  longBreak: number
  cycles: number
}

export default class RoomsRepository {
  async insertOne(values: RoomInserOneValues) {
    return Room.create(values)
  }

  async findAll() {
    return Room.all()
  }

  async findOne(id: string) {
    return Room.find(id)
  }

  async joinRoom(id: string, userId: string) {
    const room = await Room.find(id)

    return await room?.related('users').attach([userId])
  }

  // async leaveRoom(id: string, userId: string) {
  //   const room = await Room.find(id)

  //   return await room?.related('users').detach([userId])
  // }

  async startRoom(id: string) {
    return (await Room.find(id))?.merge({ isRoomStarted: true }).save()
  }

  async stopRoom(id: string) {
    const room = await Room.find(id)
    return room?.merge({ isRoomStarted: false }).save()
  }
}
