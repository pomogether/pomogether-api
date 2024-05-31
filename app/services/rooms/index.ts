import RoomNotFoundException from '#exceptions/room_not_found'
import UserAlreadyInRoomException from '#exceptions/user_already_in_room'
import UserNotFoundException from '#exceptions/user_not_found'
import RoomsRepository from '#repositories/rooms'
import UsersRepository from '#repositories/users'
import { inject } from '@adonisjs/core'
import { PomoTimer } from '@pomogether/commons/libs'
import {} from 'node:worker_threads'

const buildRoomKey = (id: string) => `room:${id}`
const buildRoomHashData = <T extends {}>(data: T) => ({ ...data })

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
    return this.roomsRepository.findOne(id)
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
    // Criar execption para quando o usuário não estiver na sala, usando essa apenas para validao por enquanto
    if (!isUserInRoom) throw new UserNotFoundException()

    const isRoomAlreadyStarted = room.isRoomStarted
    // Criar execption para quando o usuário não estiver na sala, usando essa apenas para validao por enquanto
    if (isRoomAlreadyStarted) throw new Error('Room already started')

    await this.roomsRepository.startRoom(id)

    // const roomTimer: PomoTimer =
    //   pomoTimerStateManager.getState(id) ||
    //   pomoTimerStateManager.setState(
    //     id,
    //     new PomoTimer(room.pomodoro, {
    //       onStart: async (pomoTimer) => {
    //         const roomHashData = buildRoomHashData({
    //           currentTime: pomoTimer.time,
    //           ...room?.toJSON(),
    //         })
    //         redis.hset(buildRoomKey(id), roomHashData)
    //         redis.publish(RoomsEvents.STARTED, JSON.stringify(roomHashData))
    //       },
    //       onTick: async (pomoTimer) => {
    //         const roomHashData = await redis.hgetall(buildRoomKey(id))
    //         if (!roomHashData) return

    //         redis.hset(
    //           buildRoomKey(id),
    //           buildRoomHashData({
    //             ...roomHashData,
    //             currentTime: pomoTimer.time,
    //           })
    //         )
    //         redis.publish(TimerEvents.TICK, JSON.stringify(roomHashData))
    //       },
    //     })
    //   )

    // roomTimer.start()
  }

  // async pauseRoom(id: string, userId: string) {
  //   const room = await this.roomsRepository.findOne(id)
  //   const roomTimer: PomoTimer | undefined = pomoTimerStateManager.getState(id)
  //   if (!room || !roomTimer) throw new RoomNotFoundException()

  //   const isUserInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
  //   // Criar execption para quando o usuário não estiver na sala, usando essa apenas para validao por enquanto
  //   if (!isUserInRoom) throw new UserNotFoundException()

  //   const isRoomStarted = room.isRoomStarted
  //   // Criar execption para quando o usuário não estiver na sala, usando essa apenas para validao por enquanto
  //   if (!isRoomStarted) throw new Error('Room not started yet')

  //   await this.roomsRepository.stopRoom(id)
  //   roomTimer.pause()
  // }

  // async leaveRoom(id: string, userId: string) {
  //   const roomExists = Boolean(await this.roomsRepository.findOne(id))
  //   if (!roomExists) throw new RoomNotFoundException()

  //   const userInRoom = Boolean(await this.usersRepository.findUserByRoom(userId, id))
  //   if (!userInRoom) throw new UserNotInRoomException()

  //   this.roomsRepository.leaveRoom(id, userId)
  // }
}
