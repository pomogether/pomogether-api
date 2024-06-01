import factory from '@adonisjs/lucid/factories'
import Room from '#models/room'
import { RoomStatus } from '#models/room/enums'

export const RoomFactory = factory
  .define(Room, async ({ faker }) => {
    return {
      name: faker.lorem.words(3),
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      cycles: 4,
      currentTime: '25:00',
      status: RoomStatus.CREATED,
    }
  })
  .build()
