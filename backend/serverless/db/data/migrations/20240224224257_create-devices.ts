import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema
      .createTable("devices", table => {
        table.uuid("id").primary();
        table.string("deviceType").notNullable();
        table.boolean("breakingNewsAlerts").notNullable();
        table.boolean("weeklySummaryAlerts").notNullable();
        table.string("expoPushToken").unique();
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
          table.string("time").notNullable();
          table.string("title").notNullable();
          table.string("body").notNullable();
        })
      );
}


export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTableIfExists("users");
   await knex.schema.dropTableIfExists("devices");
   return knex.schema.dropTableIfExists("notifications");
}

