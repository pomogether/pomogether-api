import { RoomFactory } from '#factories/room'
import { UserFactory } from '#factories/user'
import Room from '#models/room'
import { RoomStatus } from '#models/room/enums'
import User from '#models/user'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('GET /rooms', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return empty array', async ({ client }) => {
    const response = await client.get('/rooms')

    response.assertStatus(200)
    response.assertBody([])
  })

  test('should return all rooms', async ({ client }) => {
    const room = (await RoomFactory.merge({ timerId: null }).create()).toJSON()
    const response = await client.get('/rooms')

    response.assertStatus(200)
    response.assertBody([room])
  })
})

test.group('GET /rooms/:id', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return 404 when room does not exist', async ({ client, faker }) => {
    const response = await client.get(`/rooms/${faker.string.uuid()}`)

    response.assertStatus(404)
  })

  test('should return room by id', async ({ client }) => {
    const room = (await RoomFactory.merge({ timerId: null }).create()).toJSON()
    const response = await client.get(`/rooms/${room.id}`)

    response.assertStatus(200)
    response.assertBody(room)
  })
})

test.group('POST /rooms', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should create a new room', async ({ client }) => {
    const room = (await RoomFactory.make()).toJSON()
    const response = await client.post('/rooms').json(room)

    response.assertStatus(200)
  })

  test('should return 422 when validation fails', async ({ client }) => {
    const response = await client.post('/rooms').json({})

    response.assertStatus(422)
  })
})

test.group('PUT /rooms/:id/join', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const getUser = async (id: string) => (await User.find(id))?.related('room').query().first()

  test('should return 422 when user id is not provided', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client.put(`/rooms/${room.id}/join`)

    response.assertStatus(422)
  })

  test('should return 404 when room does not exist', async ({ client, faker }) => {
    const response = await client
      .put(`/rooms/${faker.string.uuid()}/join`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 404 when user does not exist', async ({ client, faker }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client
      .put(`/rooms/${room.id}/join`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 409 when user already in room', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()
    await client.put(`/rooms/${room.id}/join`).headers({ 'x-user-id': user.id })

    const response = await client.put(`/rooms/${room.id}/join`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)
  })

  test('should join room', async ({ client, assert }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()
    const preJoinUser = await getUser(user.id)

    assert.isNull(preJoinUser)

    const response = await client.put(`/rooms/${room.id}/join`).headers({ 'x-user-id': user.id })
    const postJoinUser = await getUser(user.id)

    response.assertStatus(204)
    assert.equal(postJoinUser?.id, room.id)
  })
})

test.group('PUT /rooms/:id/leave', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const getUser = async (id: string) => (await User.find(id))?.related('room').query().first()

  test('should return 422 when user id is not provided', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client.put(`/rooms/${room.id}/leave`)

    response.assertStatus(422)
  })

  test('should return 404 when room does not exist', async ({ client, faker }) => {
    const response = await client
      .put(`/rooms/${faker.string.uuid()}/leave`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 404 when user does not exist', async ({ client, faker }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client
      .put(`/rooms/${room.id}/leave`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 409 when user is not in room', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/leave`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)
  })

  test('should leave room', async ({ client, assert }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()
    await client.put(`/rooms/${room.id}/join`).headers({ 'x-user-id': user.id })

    const preLeaveUser = await getUser(user.id)
    assert.isNotNull(preLeaveUser)

    const response = await client.put(`/rooms/${room.id}/leave`).headers({ 'x-user-id': user.id })
    const postLeaveUser = await getUser(user.id)

    response.assertStatus(204)
    assert.isNull(postLeaveUser)
  })
})

test.group('PUT /rooms/:id/start', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return 422 when user id is not provided', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client.put(`/rooms/${room.id}/start`)

    response.assertStatus(422)
  })

  test('should return 404 when room does not exist', async ({ client, faker }) => {
    const response = await client
      .put(`/rooms/${faker.string.uuid()}/start`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 404 when user does not exist', async ({ client, faker }) => {
    const room = (await RoomFactory.create()).toJSON()

    const response = await client
      .put(`/rooms/${room.id}/start`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 409 when user is not in room', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/start`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)
  })

  test('should return 409 when room already started', async ({ client }) => {
    const room = (await RoomFactory.merge({ status: RoomStatus.RUNNING }).create()).toJSON()
    const user = (await UserFactory.merge({ roomId: room.id }).create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/start`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)

    await client.put(`/rooms/${room.id}/pause`).headers({ 'x-user-id': user.id })
  })

  test('should start room', async ({ client, assert }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.merge({ roomId: room.id }).create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/start`).headers({ 'x-user-id': user.id })

    response.assertStatus(204)
    assert.isTrue((await Room.find(room.id))?.isRoomStarted)

    await client.put(`/rooms/${room.id}/pause`).headers({ 'x-user-id': user.id })
  })
})

test.group('PUT /rooms/:id/pause', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('should return 422 when user id is not provided', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client.put(`/rooms/${room.id}/pause`)

    response.assertStatus(422)
  })

  test('should return 404 when room does not exist', async ({ client, faker }) => {
    const response = await client
      .put(`/rooms/${faker.string.uuid()}/pause`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 404 when user does not exist', async ({ client, faker }) => {
    const room = (await RoomFactory.create()).toJSON()
    const response = await client
      .put(`/rooms/${room.id}/pause`)
      .headers({ 'x-user-id': faker.string.uuid() })

    response.assertStatus(404)
  })

  test('should return 409 when user is not in room', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.merge({ roomId: room.id }).create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/pause`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)
  })

  test('should return 409 when room is not started', async ({ client }) => {
    const room = (await RoomFactory.create()).toJSON()
    const user = (await UserFactory.create()).toJSON()

    await client.put(`/rooms/${room.id}/join`).headers({ 'x-user-id': user.id })

    const response = await client.put(`/rooms/${room.id}/pause`).headers({ 'x-user-id': user.id })

    response.assertStatus(409)
  })

  test('should pause room', async ({ client, assert }) => {
    const room = (await RoomFactory.merge({ status: RoomStatus.RUNNING }).create()).toJSON()
    const user = (await UserFactory.merge({ roomId: room.id }).create()).toJSON()

    const response = await client.put(`/rooms/${room.id}/pause`).headers({ 'x-user-id': user.id })

    response.assertStatus(204)
    assert.isFalse((await Room.find(room.id))?.isRoomStarted)
  })
})
