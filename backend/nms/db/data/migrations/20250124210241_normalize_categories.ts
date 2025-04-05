import type { Knex } from 'knex';
/**
 * This migration normalizes the category data model by:
 * 1. Creating a dedicated categories table to store unique category names
 * 2. Creating a device_preferences junction table to track which devices are subscribed to which categories
 * 3. Creating a notification_categories junction table to track which notifications belong to which categories
 * 4. Seeding the categories table with the initial set of known categories
 *
 * This replaces the previous data model where categories were stored as boolean columns on each device and notification.
 * This new data model is more efficient since the categories are stored in a single table and referenced by foreign keys.
 */

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

// Database-specific implementations for dropping default constraints
async function dropDefaultConstraint(knex: Knex, tableName: string, columnName: string) {
  const dbType = getDatabaseType(knex);

  switch (dbType) {
    case 'mssql':
      // This raw SQL query finds the default constraint for a given column and drops it in SQL Server
      await knex.raw(`
        DECLARE @sql NVARCHAR(max) = N'';
        SELECT @sql = N'ALTER TABLE ' + QUOTENAME('${tableName}') + ' DROP CONSTRAINT ' + QUOTENAME(dc.[name])
        FROM sys.default_constraints dc
        INNER JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
        INNER JOIN sys.tables t ON t.object_id = c.object_id
        WHERE t.name = '${tableName}' AND c.name = '${columnName}';
        IF (@sql <> N'')
          EXEC sp_executesql @sql;
      `);
      break;

    case 'pg':
      // PostgreSQL approach to dropping a default constraint
      await knex.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT`);
      break;

    case 'sqlite3':
      // SQLite doesn't support directly dropping default constraints
      // For SQLite, we can't easily drop the default - it requires rebuilding the entire table
      // For SQLite, we need to recreate the table without the default constraint
      // Get the table info
      const tableInfo = await knex.raw(`PRAGMA table_info(${tableName})`);

      // Create a temporary table with the same structure but without the default for the specified column
      await knex.schema.createTable(`${tableName}_temp`, (table) => {
        for (const column of tableInfo) {
          const colName = column.name;
          const colType = column.type;
          const notNull = column.notnull === 1;
          const isPrimary = column.pk === 1;

          if (colName === columnName) {
            // Create the column without the default constraint
            if (isPrimary) {
              table.specificType(colName, colType).primary().notNullable();
            } else if (notNull) {
              table.specificType(colName, colType).notNullable();
            } else {
              table.specificType(colName, colType);
            }
          } else {
            // Recreate other columns as they were
            if (isPrimary) {
              table.specificType(colName, colType).primary().notNullable();
            } else if (notNull) {
              table.specificType(colName, colType).notNullable();
            } else {
              table.specificType(colName, colType);
            }
          }
        }
      });

      // Copy data from the original table to the temporary table
      await knex.raw(`INSERT INTO ${tableName}_temp SELECT * FROM ${tableName}`);

      // Drop the original table
      await knex.schema.dropTable(tableName);

      // Rename the temporary table to the original table name
      await knex.schema.renameTable(`${tableName}_temp`, tableName);

      console.log(
        `SQLite: Recreated table ${tableName} without default constraint for ${columnName}`
      );
      break;

    default:
      console.warn(`Unsupported database type: ${dbType}. Default constraint dropping may fail.`);
      // Fall back to a generic approach for unknown databases
      try {
        // Different databases have different syntax for dropping default constraints
        // Try a few common approaches
        if (dbType === 'other') {
          // First try PostgreSQL-style syntax as it's common
          try {
            await knex.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT`);
          } catch (firstErr) {
            console.warn(`First approach failed: ${firstErr}`);
            // If that fails, try MySQL-style syntax
            try {
              await knex.raw(`ALTER TABLE \`${tableName}\` ALTER \`${columnName}\` DROP DEFAULT`);
            } catch (secondErr) {
              console.warn(`Second approach failed: ${secondErr}`);
              // Last resort: try to use the schema builder
              await knex.schema.alterTable(tableName, (table) => {
                // This is a generic approach that might work for some databases
                // We can't use dropDefault directly as it's not available in all Knex versions
                table.specificType(columnName, 'DROP DEFAULT');
              });
            }
          }
        } else {
          // Use the raw query which is more generic
          await knex.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "${columnName}" DROP DEFAULT`);
        }
      } catch (err) {
        console.error(`Failed to drop default constraint: ${err}`);
        // If all approaches fail, log the error but continue execution
      }
  }
}

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // 1) CREATE categories TABLE
    await knex.schema.createTable('categories', (table) => {
      table.increments('id').primary();
      table.string('name').unique().notNullable();
    });

    // 2) CREATE device_preferences TABLE
    await knex.schema.createTable('device_preferences', (table) => {
      table.uuid('device_id').references('id').inTable('devices').onDelete('CASCADE').notNullable();
      table
        .integer('category_id')
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .notNullable();

      table.primary(['device_id', 'category_id']);
    });

    // 3) CREATE notification_categories TABLE
    await knex.schema.createTable('notification_categories', (table) => {
      table
        .integer('notification_id')
        .references('id')
        .inTable('notifications')
        .onDelete('CASCADE')
        .notNullable();
      table
        .integer('category_id')
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .notNullable();

      table.primary(['notification_id', 'category_id']);
    });

    // 4) SEED categories with the known categories
    const categoryNames = [
      'Breaking News',
      'University News',
      'Metro',
      'Sports',
      'Arts and Culture',
      'Science and Research',
      'Opinions',
    ];

    const insertedCategories = await knex('categories')
      .insert(categoryNames.map((name) => ({ name })))
      .returning(['id', 'name']);

    // Build a name→id lookup so we know which ID belongs to each category
    const categoryMap: Record<string, number> = {};
    insertedCategories.forEach((cat: any) => {
      categoryMap[cat.name] = cat.id;
    });

    // 5) MIGRATE existing device booleans -> device_preferences
    type DeviceRow = {
      id: string;
      // The columns are spelled EXACTLY as in the existing schema
      'Breaking News': boolean;
      'University News': boolean;
      Metro: boolean;
      Sports: boolean;
      'Arts and Culture': boolean;
      'Science and Research': boolean;
      Opinions: boolean;
    };

    const devices: DeviceRow[] = await knex<DeviceRow>('devices').select('*');

    for (const device of devices) {
      for (const catName of categoryNames) {
        if (device[catName as keyof DeviceRow] === true) {
          await knex('device_preferences').insert({
            device_id: device.id,
            category_id: categoryMap[catName],
          });
        }
      }
    }

    // 6) DROP old device boolean columns:
    const deviceColumns = [
      'Breaking News',
      'University News',
      'Metro',
      'Sports',
      'Arts and Culture',
      'Science and Research',
      'Opinions',
    ];

    // Get the database type
    const dbType = getDatabaseType(knex);

    // First, drop default constraints for each column - this depends on database type
    for (const col of deviceColumns) {
      await dropDefaultConstraint(knex, 'devices', col);
    }

    // Then drop the columns using database-specific syntax
    if (dbType === 'mssql') {
      // SQL Server uses square brackets for identifiers with spaces
      await knex.raw(`
        ALTER TABLE devices
        DROP COLUMN [Breaking News],
                    [University News],
                    [Metro],
                    [Sports],
                    [Arts and Culture],
                    [Science and Research],
                    [Opinions]
      `);
    } else if (dbType === 'pg') {
      // PostgreSQL uses double quotes for identifiers with spaces
      await knex.raw(`
        ALTER TABLE devices
        DROP COLUMN "Breaking News",
                    "University News",
                    "Metro",
                    "Sports",
                    "Arts and Culture",
                    "Science and Research",
                    "Opinions"
      `);
    } else if (dbType === 'sqlite3') {
      // SQLite has limited ALTER TABLE support
      // For SQLite, we need to drop columns one by one (if supported)
      // or create a new table, copy data, and rename
      console.log('SQLite: Using individual column drops for devices table');

      // SQLite doesn't support dropping multiple columns in one statement
      // and has limited ALTER TABLE support in general
      // In newer SQLite versions with DROP COLUMN support:
      for (const col of deviceColumns) {
        try {
          await knex.schema.alterTable('devices', (table) => {
            // Use quotes for column names with spaces
            table.dropColumn(col);
          });
        } catch (err) {
          console.error(`Failed to drop column ${col}: ${err}`);
          // May need to implement table rebuild strategy for SQLite
          // if column dropping fails
        }
      }
    } else {
      // Generic approach for other databases
      console.warn(`Using generic approach for dropping columns on ${dbType}`);
      try {
        await knex.schema.alterTable('devices', (table) => {
          for (const col of deviceColumns) {
            table.dropColumn(col);
          }
        });
      } catch (err) {
        console.error(`Failed to drop columns: ${err}`);
      }
    }

    // 7) MIGRATE existing notification booleans -> notification_categories
    type NotificationRow = {
      id: number;
      'Breaking News': boolean;
      'University News': boolean;
      Metro: boolean;
      Sports: boolean;
      'Arts and Culture': boolean;
      'Science and Research': boolean;
      Opinions: boolean;
    };

    const notifications: NotificationRow[] =
      await knex<NotificationRow>('notifications').select('*');

    for (const notification of notifications) {
      for (const catName of categoryNames) {
        if (notification[catName as keyof NotificationRow] === true) {
          await knex('notification_categories').insert({
            notification_id: notification.id,
            category_id: categoryMap[catName],
          });
        }
      }
    }

    // 8) DROP old notification boolean columns.
    // Again drop default constraints first.
    const notificationColumns = [
      'Breaking News',
      'University News',
      'Metro',
      'Sports',
      'Arts and Culture',
      'Science and Research',
      'Opinions',
    ];

    // First drop default constraints for each column
    for (const col of notificationColumns) {
      await dropDefaultConstraint(knex, 'notifications', col);
    }

    // Then drop the columns using database-specific syntax
    if (dbType === 'mssql') {
      // SQL Server uses square brackets for identifiers with spaces
      await knex.raw(`
        ALTER TABLE notifications
        DROP COLUMN [Breaking News],
                    [University News],
                    [Metro],
                    [Sports],
                    [Arts and Culture],
                    [Science and Research],
                    [Opinions]
      `);
    } else if (dbType === 'pg') {
      // PostgreSQL uses double quotes for identifiers with spaces
      await knex.raw(`
        ALTER TABLE notifications
        DROP COLUMN "Breaking News",
                    "University News",
                    "Metro",
                    "Sports",
                    "Arts and Culture",
                    "Science and Research",
                    "Opinions"
      `);
    } else if (dbType === 'sqlite3') {
      // SQLite doesn't support dropping multiple columns in one statement
      // In newer SQLite versions with DROP COLUMN support:
      console.log('SQLite: Using individual column drops for notifications table');
      for (const col of notificationColumns) {
        try {
          await knex.schema.alterTable('notifications', (table) => {
            table.dropColumn(col);
          });
        } catch (err) {
          console.error(`Failed to drop column ${col}: ${err}`);
          // May need to implement table rebuild strategy for SQLite
        }
      }
    } else {
      // Generic approach for other databases
      console.warn(`Using generic approach for dropping columns on ${dbType}`);
      try {
        await knex.schema.alterTable('notifications', (table) => {
          for (const col of notificationColumns) {
            table.dropColumn(col);
          }
        });
      } catch (err) {
        console.error(`Failed to drop columns: ${err}`);
      }
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // 1) Add back old boolean columns to devices
    await knex.schema.alterTable('devices', (table) => {
      table.boolean('Breaking News').notNullable().defaultTo(false);
      table.boolean('University News').notNullable().defaultTo(false);
      table.boolean('Metro').notNullable().defaultTo(false);
      table.boolean('Sports').notNullable().defaultTo(false);
      table.boolean('Arts and Culture').notNullable().defaultTo(false);
      table.boolean('Science and Research').notNullable().defaultTo(false);
      table.boolean('Opinions').notNullable().defaultTo(false);
    });

    // 2) Add back old boolean columns to notifications
    await knex.schema.alterTable('notifications', (table) => {
      table.boolean('Breaking News').notNullable().defaultTo(false);
      table.boolean('University News').notNullable().defaultTo(false);
      table.boolean('Metro').notNullable().defaultTo(false);
      table.boolean('Sports').notNullable().defaultTo(false);
      table.boolean('Arts and Culture').notNullable().defaultTo(false);
      table.boolean('Science and Research').notNullable().defaultTo(false);
      table.boolean('Opinions').notNullable().defaultTo(false);
    });

    // 3) Re-populate those columns if needed (simplified example)
    const categoryRows = await knex('categories').select('*');
    const catIdToNameMap = categoryRows.reduce(
      (acc, row) => {
        acc[row.id] = row.name;
        return acc;
      },
      {} as Record<number, string>
    );

    // device_preferences -> update device booleans
    const devPrefs = await knex('device_preferences').select('*');
    const deviceCatMap: Record<string, string[]> = {};
    for (const dp of devPrefs) {
      if (!deviceCatMap[dp.device_id]) {
        deviceCatMap[dp.device_id] = [];
      }
      deviceCatMap[dp.device_id].push(catIdToNameMap[dp.category_id]);
    }

    for (const [deviceId, catList] of Object.entries(deviceCatMap)) {
      const updateObj: Record<string, boolean> = {};
      for (const categoryName of catList) {
        updateObj[categoryName] = true;
      }
      await knex('devices').where('id', deviceId).update(updateObj);
    }

    // notification_categories -> update notification booleans
    const notiPrefs = await knex('notification_categories').select('*');
    const notiCatMap: Record<number, string[]> = {};
    for (const np of notiPrefs) {
      if (!notiCatMap[np.notification_id]) {
        notiCatMap[np.notification_id] = [];
      }
      notiCatMap[np.notification_id].push(catIdToNameMap[np.category_id]);
    }

    for (const [notificationIdStr, catList] of Object.entries(notiCatMap)) {
      const notificationId = Number(notificationIdStr);
      const updateObj: Record<string, boolean> = {};
      for (const categoryName of catList) {
        updateObj[categoryName] = true;
      }
      await knex('notifications').where('id', notificationId).update(updateObj);
    }

    // 4) Drop new join tables and categories
    await knex.schema.dropTableIfExists('notification_categories');
    await knex.schema.dropTableIfExists('device_preferences');
    await knex.schema.dropTableIfExists('categories');
  });
}
