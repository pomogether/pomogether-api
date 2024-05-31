import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { RoomStatus } from '#models/room/enums'
import User from '#models/user'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare status: RoomStatus

  @column()
  declare pomodoro: number

  @column()
  declare shortBreak: number

  @column()
  declare longBreak: number

  @column()
  declare cycles: number

  @column()
  declare isRoomStarted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'users_rooms',
  })
  declare users: ManyToMany<typeof User>
}
