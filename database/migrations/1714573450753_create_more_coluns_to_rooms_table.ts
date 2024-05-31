import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('pomodoro').defaultTo(25).notNullable()
      table.integer('short_break').defaultTo(5).notNullable()
      table.integer('long_break').defaultTo(15).notNullable()
      table.integer('cycles').defaultTo(4).notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('pomodoro')
      table.dropColumn('short_break')
      table.dropColumn('long_break')
      table.dropColumn('cycles')
    })
  }
}
