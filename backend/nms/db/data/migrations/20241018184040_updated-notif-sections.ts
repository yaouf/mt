import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .table('notifications', (table) => {
      table.boolean('Sports').notNullable().defaultTo(false);
      table.boolean('Arts and Culture').notNullable().defaultTo(false);
      table.boolean('Science and Research').notNullable().defaultTo(false);
      table.boolean('Opinions').notNullable().defaultTo(false);
    })
    .then(() =>
      knex.schema.table('devices', (table) => {
        table.boolean('Sports').notNullable().defaultTo(false);
        table.boolean('Arts and Culture').notNullable().defaultTo(false);
        table.boolean('Science and Research').notNullable().defaultTo(false);
        table.boolean('Opinions').notNullable().defaultTo(false);
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .table('notifications', (table) => {
      table.dropColumn('Sports');
      table.dropColumn('Arts and Culture');
      table.dropColumn('Science and Research');
      table.dropColumn('Opinions');
    })
    .then(() =>
      knex.schema.table('devices', (table) => {
        table.dropColumn('Sports');
        table.dropColumn('Arts and Culture');
        table.dropColumn('Science and Research');
        table.dropColumn('Opinions');
      })
    );
}
