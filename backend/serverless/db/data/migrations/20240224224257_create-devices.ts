import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("devices", table => {
      table.uuid("id").primary();
      table.string("deviceType").notNullable();
      table.boolean("Breaking News").notNullable();
      table.boolean("University News").notNullable();
      table.boolean("Metro").notNullable();
      table.boolean("Sports").notNullable().defaultTo(false);
      table.boolean("Arts and Culture").notNullable().defaultTo(false);
      table.boolean("Science and Research").notNullable().defaultTo(false);
      table.boolean("Opinions").notNullable().defaultTo(false);
      table.string("expoPushToken").unique().notNullable();
      table.boolean("isPushEnabled").notNullable();
    })
    .then(() =>
      knex.schema.createTable("users", table => {
        table.uuid("id").primary();
        table.string("email").unique().notNullable();
        table.string("name").notNullable();
      })
    )
    .then(() =>
      knex.schema.createTable("notifications", table => {
        table.increments("id").primary();
        table.string("time").notNullable();
        table.string("title").notNullable();
        table.string("body").nullable();
        table.boolean("Breaking News").notNullable();
        table.boolean("University News").notNullable();
        table.boolean("Metro").notNullable();
        table.boolean("Sports").notNullable().defaultTo(false);
        table.boolean("Arts and Culture").notNullable().defaultTo(false);
        table.boolean("Science and Research").notNullable().defaultTo(false);
        table.boolean("Opinions").notNullable().defaultTo(false);
        table.string("url").nullable();
        table.string("status").notNullable();
        table.boolean("isUid").notNullable();
      })
    ).then(() => 
      knex.schema.createTable("editorspicks", table => {
      table.increments("id").primary();
      table.string("url").notNullable().unique();
      }));
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("devices");
  await knex.schema.dropTableIfExists("editorspicks");
  return knex.schema.dropTableIfExists("notifications");
}
