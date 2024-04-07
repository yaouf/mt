import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("devices", table => {
      table.uuid("id").primary();
      table.string("deviceType").notNullable();
      table.boolean("Breaking News").notNullable();
      table.boolean("Weekly Summary").notNullable();
      table.boolean("Daily Summary").notNullable();
      table.string("expoPushToken").unique();
    })
    .then(() =>
      knex.schema.createTable("users", table => {
        table.uuid("id").primary();
        table.string("email").unique().notNullable();
        table.string("name").notNullable();
      }))
      .then(() =>
        knex.schema.createTable("notifications", table => {
          table.increments("id").primary();
          table.string("time").notNullable();
          table.string("title").notNullable();
          table.string("body").nullable();
          table.string("slug").nullable();
          table.boolean("Breaking News").notNullable();
          table.boolean("Weekly Summary").notNullable();
          table.boolean("Daily Summary").notNullable();
          table.string("status").notNullable();
        })
      );
}

export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTableIfExists("users");
   await knex.schema.dropTableIfExists("devices");
   return knex.schema.dropTableIfExists("notifications");
}
