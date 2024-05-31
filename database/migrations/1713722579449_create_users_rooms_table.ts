import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('user_id').unsigned().references('users.id')
      table.uuid('room_id').unsigned().references('rooms.id')
      table.unique(['user_id', 'room_id'])
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
