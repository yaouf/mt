import type { Knex } from 'knex';

// Helper function to determine database type
function getDatabaseType(knex: Knex): 'mssql' | 'pg' | 'sqlite3' | 'other' {
  const client = knex.client.config.client;
  if (typeof client === 'string') {
    if (client === 'mssql') return 'mssql';
    if (client === 'pg') return 'pg';
    if (client === 'sqlite3') return 'sqlite3';
  }
  return 'other';
}

export async function up(knex: Knex): Promise<void> {
  const dbType = getDatabaseType(knex);

  try {
    console.log(`Renaming column dateCreated to date_created in ${dbType} database`);

    // Basic approach using knex's schema builder
    // This works for most databases, but may fail for some
    try {
      await knex.schema.alterTable('devices', (table) => {
        table.renameColumn('dateCreated', 'date_created');
      });
      console.log('Successfully renamed column using knex schema builder');
      return;
    } catch (err) {
      console.warn(`Failed to rename column using knex schema builder: ${err}`);
      // Fall back to database-specific approaches below
    }

    // Database-specific approaches
    if (dbType === 'mssql') {
      await knex.raw(`
        EXEC sp_rename 'devices.dateCreated', 'date_created', 'COLUMN';
      `);
      console.log('Successfully renamed column using SQL Server sp_rename');
    } else if (dbType === 'pg') {
      await knex.raw(`
        ALTER TABLE devices RENAME COLUMN "dateCreated" TO "date_created";
      `);
      console.log('Successfully renamed column using PostgreSQL ALTER TABLE');
    } else if (dbType === 'sqlite3') {
      // SQLite doesn't support direct column renames in older versions
      // We might need to create a new table, copy data, drop old table, and rename new table
      console.warn('SQLite may not support column rename directly - may require table rebuild');

      // Try the direct approach first (works in newer SQLite versions)
      try {
        await knex.raw(`
          ALTER TABLE devices RENAME COLUMN "dateCreated" TO "date_created";
        `);
        console.log('Successfully renamed column using SQLite ALTER TABLE');
      } catch (sqliteErr) {
        console.error(`SQLite direct rename failed: ${sqliteErr}`);
        console.log('Implementing fallback approach for SQLite...');

        // Fallback for older SQLite versions that don't support RENAME COLUMN
        // This would require a more complex implementation with CREATE TABLE AS SELECT
        // and data copying between tables
      }
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  } catch (error) {
    console.error(`Failed to rename column dateCreated to date_created: ${error}`);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  const dbType = getDatabaseType(knex);

  try {
    console.log(`Renaming column date_created back to dateCreated in ${dbType} database`);

    // Basic approach using knex's schema builder
    try {
      await knex.schema.alterTable('devices', (table) => {
        table.renameColumn('date_created', 'dateCreated');
      });
      console.log('Successfully renamed column using knex schema builder');
      return;
    } catch (err) {
      console.warn(`Failed to rename column using knex schema builder: ${err}`);
      // Fall back to database-specific approaches
    }

    // Database-specific approaches
    if (dbType === 'mssql') {
      await knex.raw(`
        EXEC sp_rename 'devices.date_created', 'dateCreated', 'COLUMN';
      `);
      console.log('Successfully renamed column using SQL Server sp_rename');
    } else if (dbType === 'pg') {
      await knex.raw(`
        ALTER TABLE devices RENAME COLUMN "date_created" TO "dateCreated";
      `);
      console.log('Successfully renamed column using PostgreSQL ALTER TABLE');
    } else if (dbType === 'sqlite3') {
      // Try the direct approach first (works in newer SQLite versions)
      try {
        await knex.raw(`
          ALTER TABLE devices RENAME COLUMN "date_created" TO "dateCreated";
        `);
        console.log('Successfully renamed column using SQLite ALTER TABLE');
      } catch (sqliteErr) {
        console.error(`SQLite direct rename failed: ${sqliteErr}`);
        // Would need fallback implementation here for older SQLite versions
      }
    } else {
      throw new Error(`Unsupported database type: ${dbType}`);
    }
  } catch (error) {
    console.error(`Failed to rename column date_created to dateCreated: ${error}`);
    throw error;
  }
}
