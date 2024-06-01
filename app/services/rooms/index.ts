import RoomAlreadyStartedException from '#exceptions/room_already_started'
import RoomNotFoundException from '#exceptions/room_not_found'
import RoomNotStartedYetException from '#exceptions/room_not_started_yet'
import UserAlreadyInRoomException from '#exceptions/user_already_in_room'
import UserNotFoundException from '#exceptions/user_not_found'
import UserNotInRoomException from '#exceptions/user_not_in_room'
import RoomsRepository from '#repositories/rooms'
import UsersRepository from '#repositories/users'
import { inject } from '@adonisjs/core'

@inject()
export default class RoomsService {
  constructor(
    private readonly roomsRepository: RoomsRepository,
    private readonly usersRepository: UsersRepository
  ) {}

  async createRoom(data: Parameters<typeof RoomsRepository.prototype.insertOne>[0]) {
    return this.roomsRepository.insertOne(data)
  }

  async listRooms() {
    return this.roomsRepository.findAll()
  }

  // TODO: adicionar expetion customizada para quando não encontrar a sala
  async getRoom(id: string) {
    const room = await this.roomsRepository.findOne(id)
    if (!room) throw new RoomNotFoundException()
    return room
  }

  async joinRoom(id: string, userId: string) {
    const roomExists = Boolean(await this.roomsRepository.findOne(id))
    if (!roomExists) throw new RoomNotFoundException()
    const userExists = Boolean(await this.usersRepository.findOne(userId))
    if (!userExists) throw new UserNotFoundException()

    const userAlreadyInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
    if (userAlreadyInRoom) throw new UserAlreadyInRoomException()

    this.roomsRepository.joinRoom(id, userId)
  }

  async startRoom(id: string, userId: string) {
    const room = await this.roomsRepository.findOne(id)
    if (!room) throw new RoomNotFoundException()

    const isUserInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
    if (!isUserInRoom) throw new UserNotFoundException()

    const isRoomAlreadyStarted = room.isRoomStarted
    if (isRoomAlreadyStarted) throw new RoomAlreadyStartedException()

    await this.roomsRepository.startRoom(id)
  }

  async pauseRoom(id: string, userId: string) {
    const room = await this.roomsRepository.findOne(id)
    if (!room) throw new RoomNotFoundException()

    const isUserInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
    if (!isUserInRoom) throw new UserNotFoundException()

    const isRoomStarted = room.isRoomStarted
    if (!isRoomStarted) throw new RoomNotStartedYetException()

    await this.roomsRepository.stopRoom(id)
  }

  async leaveRoom(id: string, userId: string) {
    const roomExists = Boolean(await this.roomsRepository.findOne(id))
    if (!roomExists) throw new RoomNotFoundException()

    const userInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
    if (!userInRoom) throw new UserNotInRoomException()

    this.roomsRepository.leaveRoom(id, userId)
  }
}
