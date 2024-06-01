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

test.group('RoomService.createRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should create a room with provided name', async () => {
    await sut.createRoom({ name: 'Room 1', shortBreak: 5, longBreak: 15, pomodoro: 25, cycles: 2 })
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.insertOne, {
      name: 'Room 1',
      shortBreak: 5,
      longBreak: 15,
      pomodoro: 25,
      cycles: 2,
    })
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

  test('should get a room by id', async ({assert}) => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')

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
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    fakeUserRepository.findOne.resolves(null)

    await assert.rejects(async () => sut.joinRoom('1', '1'), UserNotFoundException.message)
  })

  test('should throw an error when user is already in room', async ({ assert }) => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    // @ts-expect-error
    fakeUserRepository.findOne.resolves('mock')
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    await assert.rejects(async () => sut.joinRoom('1', '1'), UserAlreadyInRoomException.message)
  })

  test('should join user to room', async () => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    // @ts-expect-error
    fakeUserRepository.findOne.resolves('mock')
    fakeUserRepository.findUserByRoom.resolves(null)

    await sut.joinRoom('1', '1')
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.joinRoom, '1', '1')
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
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    fakeUserRepository.findUserByRoom.resolves(null)

    await assert.rejects(async () => sut.startRoom('1', '1'), UserNotFoundException.message)
  })

  test('should throw an error when room is already started', async ({ assert }) => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves({ isRoomStarted: true })
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    // TODO: usar RoomAlreadyStartedException, não fiz isso porque não foi criado ainda no código do service
    await assert.rejects(async () => sut.startRoom('1', '1'), RoomAlreadyStartedException.message)
  })

  test('should start room', async () => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves({ isRoomStarted: false })
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    await sut.startRoom('1', '1')
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.startRoom, '1')
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
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    fakeUserRepository.findUserByRoom.resolves(null)

    await assert.rejects(async () => sut.pauseRoom('1', '1'), UserNotFoundException.message)
  })

  test('should throw an error when room is already started', async ({ assert }) => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves({ isRoomStarted: false })
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    await assert.rejects(async () => sut.pauseRoom('1', '1'), RoomNotStartedYetException.message)
  })
  
  test('should pause room', async () => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves({ isRoomStarted: true })
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    await sut.pauseRoom('1', '1')
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.stopRoom, '1')
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
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    fakeUserRepository.findUserByRoom.resolves(null)

    await assert.rejects(async () => sut.leaveRoom('1', '1'), UserNotInRoomException.message)
  })

  test('should leave room', async () => {
    // @ts-expect-error
    fakeRoomsRepository.findOne.resolves('mock')
    // @ts-expect-error
    fakeUserRepository.findUserByRoom.resolves('mock')

    await sut.leaveRoom('1', '1')
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.leaveRoom, '1', '1')
  })
})
