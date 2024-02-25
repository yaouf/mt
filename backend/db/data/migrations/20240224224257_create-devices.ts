import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema
      .createTable("devices", table => {
        table.increments("id").primary();
        table.string("deviceType").notNullable();
        table.boolean("breakingNewsAlerts").notNullable();
        table.boolean("weeklySummaryAlerts").notNullable();
        table.string("expoPushToken").unique();
      })
      .then(() =>
        knex.schema.createTable("users", table => {
          table.increments("id").primary();
          table.string("email").unique().notNullable();
          table.string("name").notNullable();
        })
      );
}


export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTableIfExists("users");
   return knex.schema.dropTableIfExists("devices");
}

