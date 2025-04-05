import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('notifications', (table) => {
      table.boolean('Sports').notNullable().alter();
      table.boolean('Arts and Culture').notNullable().alter();
      table.boolean('Science and Research').notNullable().alter();
      table.boolean('Opinions').notNullable().alter();
    })
    .then(() =>
      knex.schema.alterTable('devices', (table) => {
        table.boolean('Sports').notNullable().alter();
        table.boolean('Arts and Culture').notNullable().alter();
        table.boolean('Science and Research').notNullable().alter();
        table.boolean('Opinions').notNullable().alter();
      })
    );
}
// TODO: create a migration for updating editorspicks to editors_picks

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('notifications', (table) => {
      table.boolean('Sports').notNullable().defaultTo(false).alter();
      table.boolean('Arts and Culture').notNullable().defaultTo(false).alter();
      table.boolean('Science and Research').notNullable().defaultTo(false).alter();
      table.boolean('Opinions').notNullable().defaultTo(false).alter();
    })
    .then(() =>
      knex.schema.alterTable('devices', (table) => {
        table.boolean('Sports').notNullable().defaultTo(false).alter();
        table.boolean('Arts and Culture').notNullable().defaultTo(false).alter();
        table.boolean('Science and Research').notNullable().defaultTo(false).alter();
        table.boolean('Opinions').notNullable().defaultTo(false).alter();
      })
    );
}
