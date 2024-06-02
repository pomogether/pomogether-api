import { test } from '@japa/runner'
import RoomsService from '#services/rooms'
import sinon from 'sinon'
import RoomsRepository from '#repositories/rooms'
import UsersRepository from '#repositories/users'
import RoomNotFoundException from '#exceptions/room_not_found'
import UserNotFoundException from '#exceptions/user_not_found'
import UserAlreadyInRoomException from '#exceptions/user_already_in_room'
import RoomAlreadyStartedException from '#exceptions/room_already_started'
import RoomNotStartedYetException from '#exceptions/room_not_started_yet'
import UserNotInRoomException from '#exceptions/user_not_in_room'
import { UserFactory } from '#factories/user'
import { RoomFactory } from '#factories/room'
import { faker } from '@faker-js/faker'
import { RoomStatus } from '#models/room/enums'

const buildRoom = async (attributes?: Parameters<(typeof RoomFactory)['merge']>[0]) =>
  RoomFactory.merge({ id: faker.string.uuid(), ...attributes }).make()
const buildUser = async (attributes?: Parameters<(typeof UserFactory)['merge']>[0]) =>
  UserFactory.merge({ id: faker.string.uuid(), ...attributes }).make()

test.group('RoomService.createRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should create a room with provided name', async () => {
    await sut.createRoom({ name: 'Room 1', shortBreak: 5, longBreak: 15, pomodoro: 25, cycles: 2 })

    sinon.assert.calledOnce(fakeRoomsRepository.insertOne)
  })
})

test.group('RoomService.listRooms', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should list all rooms', async () => {
    await sut.listRooms()

    sinon.assert.calledOnce(fakeRoomsRepository.findAll)
  })
})

test.group('RoomService.getRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should throw an error when room does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.getRoom('1'), RoomNotFoundException.message)
  })

  test('should get a room by id', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())

    await assert.doesNotReject(async () => sut.getRoom('1'))
  })
})

test.group('RoomService.joinRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should throw an error when room does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.joinRoom('1', '1'), RoomNotFoundException.message)
  })

  test('should throw an error when user does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())
    fakeUserRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.joinRoom('1', '1'), UserNotFoundException.message)
  })

  test('should throw an error when user is already in room', async ({ assert }) => {
    const room = await buildRoom()

    fakeRoomsRepository.findOne.resolves(room)
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await assert.rejects(async () => sut.joinRoom('1', '1'), UserAlreadyInRoomException.message)
  })

  test('should join user to room', async () => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())
    fakeUserRepository.findOne.resolves(await buildUser())

    await sut.joinRoom('1', '1')

    sinon.assert.calledOnce(fakeUserRepository.joinRoom)
  })
})

test.group('RoomService.startRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should throw an error when room does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.startRoom('1', '1'), RoomNotFoundException.message)
  })

  test('should throw an error when user is not in room', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())
    fakeUserRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.startRoom('1', '1'), UserNotFoundException.message)
  })

  test('should throw an error when room is already started', async ({ assert }) => {
    const room = await buildRoom({ status: RoomStatus.RUNNING })

    fakeRoomsRepository.findOne.resolves(room)
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await assert.rejects(async () => sut.startRoom('1', '1'), RoomAlreadyStartedException.message)
  })

  test('should start room', async () => {
    const room = await buildRoom()

    fakeRoomsRepository.findOne.resolves(room)
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await sut.startRoom('1', '1')

    sinon.assert.calledOnce(fakeRoomsRepository.startRoom)
  })
})

test.group('RoomService.pauseRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should throw an error when room does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.pauseRoom('1', '1'), RoomNotFoundException.message)
  })

  test('should throw an error when user is not in room', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())
    fakeUserRepository.findOne.resolves(await buildUser())

    await assert.rejects(async () => sut.pauseRoom('1', '1'), UserNotInRoomException.message)
  })

  test('should throw an error when room is not started yet', async ({ assert }) => {
    const room = await buildRoom({ status: RoomStatus.CREATED })

    fakeRoomsRepository.findOne.resolves(room)
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await assert.rejects(async () => sut.pauseRoom('1', '1'), RoomNotStartedYetException.message)
  })

  test('should pause room', async () => {
    const room = await buildRoom({ status: RoomStatus.RUNNING })

    fakeRoomsRepository.findOne.resolves(room) 
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await sut.pauseRoom('1', '1')

    sinon.assert.calledOnce(fakeRoomsRepository.stopRoom)
  })
})

test.group('RoomService.leaveRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should throw an error when room does not exist', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.leaveRoom('1', '1'), RoomNotFoundException.message)
  })

  test('should throw an error when user is not in room', async ({ assert }) => {
    fakeRoomsRepository.findOne.resolves(await buildRoom())
    fakeUserRepository.findOne.resolves(await buildUser())

    await assert.rejects(async () => sut.leaveRoom('1', '1'), UserNotInRoomException.message)
  })

  test('should leave room', async () => {
    const room = await buildRoom()

    fakeRoomsRepository.findOne.resolves(room) 
    fakeUserRepository.findOne.resolves(await buildUser({ roomId: room.id }))

    await sut.leaveRoom('1', '1')

    sinon.assert.calledOnce(fakeUserRepository.leaveRoom)
  })
})
