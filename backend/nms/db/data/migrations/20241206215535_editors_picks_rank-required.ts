import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  console.log('Database connection config:', {
    database: process.env.DB_URL,
  });
  return knex.schema.alterTable('editorspicks', (table) => {
    // Remove default value and add unique constraint
    table.integer('rank').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('editorspicks', (table) => {
    // Restore default value and remove unique constraint
    table.integer('rank').notNullable().defaultTo(999).alter();
  });
}
