import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("devices", (table) => {
    table.renameColumn("dateCreated", "date_created");
  });
}
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("devices", (table) => {
    table.renameColumn("date_created", "dateCreated");
  });
}
