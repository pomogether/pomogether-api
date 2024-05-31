import { test } from '@japa/runner'
import RoomsService from '#services/rooms'
import sinon from 'sinon'
import RoomsRepository from '#repositories/rooms'
import UsersRepository from '#repositories/users'

test.group('RoomService.createRoom', () => {
  const fakeRoomsRepository = sinon.createStubInstance(RoomsRepository)
  const fakeUserRepository = sinon.createStubInstance(UsersRepository)
  const sut = new RoomsService(fakeRoomsRepository, fakeUserRepository)

  test('should create a room with provided name', async () => {
    await sut.createRoom('Room 1')
    sinon.assert.calledOnceWithExactly(fakeRoomsRepository.insertOne, { name: 'Room 1' })
  })
})
