import type { Knex } from "knex";
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

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // 1) CREATE categories TABLE
    await knex.schema.createTable("categories", (table) => {
      table.increments("id").primary();
      table.string("name").unique().notNullable();
    });

    // 2) CREATE device_preferences TABLE
    await knex.schema.createTable("device_preferences", (table) => {
      table
        .uuid("device_id")
        .references("id")
        .inTable("devices")
        .onDelete("CASCADE")
        .notNullable();
      table
        .integer("category_id")
        .references("id")
        .inTable("categories")
        .onDelete("CASCADE")
        .notNullable();

      table.primary(["device_id", "category_id"]);
    });

    // 3) CREATE notification_categories TABLE
    await knex.schema.createTable("notification_categories", (table) => {
      table
        .integer("notification_id")
        .references("id")
        .inTable("notifications")
        .onDelete("CASCADE")
        .notNullable();
      table
        .integer("category_id")
        .references("id")
        .inTable("categories")
        .onDelete("CASCADE")
        .notNullable();

      table.primary(["notification_id", "category_id"]);
    });

    // 4) SEED categories with the known categories
    const categoryNames = [
      "Breaking News",
      "University News",
      "Metro",
      "Sports",
      "Arts and Culture",
      "Science and Research",
      "Opinions",
    ];

    const insertedCategories = await knex("categories")
      .insert(categoryNames.map((name) => ({ name })))
      .returning(["id", "name"]);

    // Build a name→id lookup so we know which ID belongs to "Breaking News", etc.
    const categoryMap: Record<string, number> = {};
    insertedCategories.forEach((cat: any) => {
      categoryMap[cat.name] = cat.id;
    });

    // 5) MIGRATE existing device booleans -> device_preferences
    type DeviceRow = {
      id: string;
      // The columns are spelled EXACTLY as in the existing schema
      "Breaking News": boolean;
      "University News": boolean;
      Metro: boolean;
      Sports: boolean;
      "Arts and Culture": boolean;
      "Science and Research": boolean;
      Opinions: boolean;
    };

    const devices: DeviceRow[] = await knex<DeviceRow>("devices").select("*");

    for (const device of devices) {
      for (const catName of categoryNames) {
        if (device[catName as keyof DeviceRow] === true) {
          await knex("device_preferences").insert({
            device_id: device.id,
            category_id: categoryMap[catName],
          });
        }
      }
    }

    // 6) DROP old device boolean columns via raw SQL so that column names with spaces are properly escaped
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

    // 7) MIGRATE existing notification booleans -> notification_categories
    type NotificationRow = {
      id: number;
      "Breaking News": boolean;
      "University News": boolean;
      Metro: boolean;
      Sports: boolean;
      "Arts and Culture": boolean;
      "Science and Research": boolean;
      Opinions: boolean;
    };

    const notifications: NotificationRow[] = await knex<NotificationRow>(
      "notifications"
    ).select("*");

    for (const notification of notifications) {
      for (const catName of categoryNames) {
        if (notification[catName as keyof NotificationRow] === true) {
          await knex("notification_categories").insert({
            notification_id: notification.id,
            category_id: categoryMap[catName],
          });
        }
      }
    }

    // 8) DROP old notification boolean columns via raw SQL
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
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // This "down" tries to revert to the previous structure (booleans on devices/notifications).
    // If you need to fully recover data, you'd have to re-insert booleans from these join tables.

    // 1) Add back old boolean columns to devices
    await knex.schema.alterTable("devices", (table) => {
      table.boolean("Breaking News").notNullable().defaultTo(false);
      table.boolean("University News").notNullable().defaultTo(false);
      table.boolean("Metro").notNullable().defaultTo(false);
      table.boolean("Sports").notNullable().defaultTo(false);
      table.boolean("Arts and Culture").notNullable().defaultTo(false);
      table.boolean("Science and Research").notNullable().defaultTo(false);
      table.boolean("Opinions").notNullable().defaultTo(false);
    });

    // 2) Add back old boolean columns to notifications
    await knex.schema.alterTable("notifications", (table) => {
      table.boolean("Breaking News").notNullable().defaultTo(false);
      table.boolean("University News").notNullable().defaultTo(false);
      table.boolean("Metro").notNullable().defaultTo(false);
      table.boolean("Sports").notNullable().defaultTo(false);
      table.boolean("Arts and Culture").notNullable().defaultTo(false);
      table.boolean("Science and Research").notNullable().defaultTo(false);
      table.boolean("Opinions").notNullable().defaultTo(false);
    });

    // 3) Re-populate those columns if needed (from the device_preferences / notification_categories).
    //    This is a simplified example. Real usage may need a transaction or other checks.

    const categoryRows = await knex("categories").select("*");
    const catIdToNameMap = categoryRows.reduce((acc, row) => {
      acc[row.id] = row.name;
      return acc;
    }, {} as Record<number, string>);

    // device_preferences -> set device booleans
    const devPrefs = await knex("device_preferences").select("*");
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
      await knex("devices").where("id", deviceId).update(updateObj);
    }

    // notification_categories -> set notification booleans
    const notiPrefs = await knex("notification_categories").select("*");
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
      await knex("notifications").where("id", notificationId).update(updateObj);
    }

    // 4) Drop new join tables and categories
    await knex.schema.dropTableIfExists("notification_categories");
    await knex.schema.dropTableIfExists("device_preferences");
    await knex.schema.dropTableIfExists("categories");
  });
}
