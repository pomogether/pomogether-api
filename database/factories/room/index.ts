import factory from '@adonisjs/lucid/factories'
import Room from '#models/room'
import { RoomStatus } from '#models/room/enums'
import { DateTime } from 'luxon'

export const RoomFactory = factory
  .define(Room, async ({ faker }) => {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(Object.values(RoomStatus)),
      createdAt: DateTime.fromFormat(faker.date.recent().toISOString(), 'yyyy-MM-dd HH:mm:ss'),
      updatedAt: DateTime.fromFormat(faker.date.recent().toISOString(), 'yyyy-MM-dd HH:mm:ss')
    }
  })
  .build()
