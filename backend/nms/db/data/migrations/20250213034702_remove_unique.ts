import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Simpler approach to drop all unique constraints on the editors_picks table
  return knex.raw(`
    DECLARE @sql NVARCHAR(MAX) = '';
    
    SELECT @sql = @sql + 'ALTER TABLE editors_picks DROP CONSTRAINT ' + name + ';'
    FROM sys.key_constraints
    WHERE parent_object_id = OBJECT_ID('editors_picks')
    AND type = 'UQ';
    
    IF LEN(@sql) > 0
      EXEC sp_executesql @sql;
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.unique(["rank"]);
  });
}
