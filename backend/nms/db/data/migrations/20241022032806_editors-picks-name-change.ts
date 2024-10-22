import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.renameTable("editorsPicks", "editors_picks");
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.renameTable("editors_picks", "editorsPicks");
}

