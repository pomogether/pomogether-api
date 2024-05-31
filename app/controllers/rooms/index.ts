import type { HttpContext } from '@adonisjs/core/http'

import RoomsService from '#services/rooms'
import { inject } from '@adonisjs/core'
import { createRoomValidator } from '#validators/room'

@inject()
export default class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  async list() {
    const rooms = await this.roomsService.listRooms()

    return rooms
  }

  async show({ params }: HttpContext) {
    const room = await this.roomsService.getRoom(params.id)

    return room
  }

  async create({ request }: HttpContext) {
    const payload = await request.validateUsing(createRoomValidator)

    const roomData = await this.roomsService.createRoom(payload)

    return roomData
  }

  async join({ params, response, request }: HttpContext) {
    await this.roomsService.joinRoom(params.id, request.header('X-User-Id') || '')

    return response.noContent()
  }

  async start({ params, response, request }: HttpContext) {
    await this.roomsService.startRoom(params.id, request.header('X-User-Id') || '')

    return response.noContent()
  }

  async pause({ params, response, request }: HttpContext) {
    await this.roomsService.pauseRoom(params.id, request.header('X-User-Id') || '')

    return response.noContent()
  }

  // async leave({ params, response, request }: HttpContext) {
  //   await this.roomsService.leaveRoom(params.id, request.header('X-User-Id') || '')

  //   return response.noContent()
  // }
}
