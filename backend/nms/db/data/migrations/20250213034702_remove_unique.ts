import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const dbType = knex.client.config.client;

  if (dbType === 'mssql') {
    // SQL Server approach
    return knex.raw(`
      DECLARE @sql NVARCHAR(MAX) = '';
      
      SELECT @sql = @sql + 'ALTER TABLE editors_picks DROP CONSTRAINT ' + name + ';'
      FROM sys.key_constraints
      WHERE parent_object_id = OBJECT_ID('editors_picks')
      AND type = 'UQ';
      
      IF LEN(@sql) > 0
        EXEC sp_executesql @sql;
    `);
  } else if (dbType === 'sqlite3') {
    // For SQLite, we need to recreate the table without the unique constraint
    // First, get the table info
    const tableInfo = await knex.raw('PRAGMA table_info(editors_picks)');

    // Create a new table without the unique constraint
    await knex.schema.createTable('editors_picks_new', (table) => {
      // Recreate all columns from the original table
      for (const column of tableInfo) {
        const colName = column.name;
        const colType = column.type;
        const notNull = column.notnull === 1;
        const isPrimary = column.pk === 1;

        if (isPrimary) {
          table.specificType(colName, colType).primary().notNullable();
        } else if (notNull) {
          table.specificType(colName, colType).notNullable();
        } else {
          table.specificType(colName, colType);
        }
      }
    });

    // Copy data from old table to new table
    await knex.raw('INSERT INTO editors_picks_new SELECT * FROM editors_picks');

    // Drop old table
    await knex.schema.dropTable('editors_picks');

    // Rename new table to old table name
    await knex.schema.renameTable('editors_picks_new', 'editors_picks');

    console.log('SQLite: Recreated editors_picks table without unique constraints');
    return;
  } else {
    // Generic approach for PostgreSQL and others
    try {
      // Try to drop the unique constraint on rank
      await knex.schema.alterTable('editors_picks', (table) => {
        table.dropUnique(['rank']);
      });
      console.log('Dropped unique constraint on editors_picks.rank');
    } catch (error) {
      console.error('Failed to drop unique constraint:', error);
      // If the specific constraint name is unknown, try a more generic approach
      console.log('Attempting alternative approach...');

      // For PostgreSQL
      if (dbType === 'pg') {
        try {
          await knex.raw(`
            DO $$
            DECLARE
              constraint_name text;
            BEGIN
              SELECT conname INTO constraint_name
              FROM pg_constraint
              WHERE conrelid = 'editors_picks'::regclass
              AND contype = 'u'
              LIMIT 1;
              
              IF constraint_name IS NOT NULL THEN
                EXECUTE 'ALTER TABLE editors_picks DROP CONSTRAINT ' || constraint_name;
              END IF;
            END $$;
          `);
          console.log('PostgreSQL: Dropped unique constraint on editors_picks');
        } catch (pgError) {
          console.error('PostgreSQL approach failed:', pgError);
        }
      }
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('editors_picks', (table) => {
    table.unique(['rank']);
  });
}
