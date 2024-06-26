import Room from '#models/room'
import { RoomStatus } from '#models/room/enums'
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

  async startRoom(id: string) {
    return (await Room.find(id))?.merge({ status: RoomStatus.RUNNING }).save()
  }

  async stopRoom(id: string) {
    const room = await Room.find(id)
    return room?.merge({ status: RoomStatus.PAUSED }).save()
  }
}
