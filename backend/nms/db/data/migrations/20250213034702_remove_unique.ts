import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // First identify if the constraint exists, then drop it
  return knex.raw(`
    IF EXISTS (
      SELECT * FROM sys.key_constraints 
      WHERE parent_object_id = OBJECT_ID('editors_picks') 
      AND type = 'UQ'
    )
    BEGIN
      DECLARE @constraintName nvarchar(128)
      SELECT @constraintName = name 
      FROM sys.key_constraints 
      WHERE parent_object_id = OBJECT_ID('editors_picks') 
      AND type = 'UQ'
      AND COL_NAME(parent_object_id, parent_column_id) = 'rank'
      
      DECLARE @sql nvarchar(500)
      SET @sql = 'ALTER TABLE editors_picks DROP CONSTRAINT ' + @constraintName
      EXEC sp_executesql @sql
    END
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.unique(["rank"]);
  });
}
