import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("devices", table => {
      table.increments("id").primary();
      table.string("deviceType").notNullable();
      table.boolean("breakingNewsAlerts").notNullable();
      table.boolean("weeklySummaryAlerts").notNullable();
      table.string("expoPushToken").unique();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("devices");
}

