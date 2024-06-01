import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('current_time').notNullable()
      table.integer('timer_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('current_time')
      table.dropColumn('timer_id')
    })
  }
}