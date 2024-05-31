import { RoomStatus } from '#models/room/enums'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .enum('status', Object.values(RoomStatus), {
          enumName: 'room_status',
          useNative: true,
          existingType: false,
        })
        .defaultTo(RoomStatus.CREATED)
        .notNullable()
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)

    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
    this.schema.raw('DROP TYPE IF EXISTS "room_status"')
  }
}
