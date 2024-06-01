import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, manyToMany } from '@adonisjs/lucid/orm'
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
  declare currentTime: string

  @column()
  declare timerId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'users_rooms',
  })
  declare users: ManyToMany<typeof User>

  get isRoomStarted() {
    return this.status === RoomStatus.RUNNING
  }

  @beforeSave()
  static convertCurrentTimeToLuxonTime(room: Room) {
    if (room.$dirty.pomodoro)
      room.currentTime = DateTime.fromObject({ minute: room.pomodoro, second: 0 }).toFormat('mm:ss')
  }

  @beforeSave()
  static startTimer(room: Room) {
    if (room.$dirty.status && room.status === RoomStatus.RUNNING) {
      room.timerId = Number(
        setInterval(async () => {
          const updatedRoom = await Room.find(room.id)
          if (!updatedRoom) return

          const currentTime = DateTime.fromFormat(updatedRoom.currentTime, 'mm:ss')
          const newTime = currentTime.minus({ seconds: 1 }).toFormat('mm:ss')

          updatedRoom.merge({ currentTime: newTime }).save()
        }, 1000)
      )
    }
  }

  @beforeSave()
  static stopTimer(room: Room) {
    const isRoomFinished = room.status === RoomStatus.FINISHED
    const isRoomPaused = room.status === RoomStatus.PAUSED
    const isRoomStopped = isRoomFinished || isRoomPaused
    
    if (room.$dirty.status && isRoomStopped) {
      // TODO: procurar uma situação onde timerId é null, porque acho que o undefined vai parar todos os timers
      clearInterval(room.timerId || undefined)
    }
  }
}
