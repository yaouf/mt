import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1) Rename editorspicks -> editors_picks
  try {
    await knex.schema.renameTable("editorspicks", "editors_picks");
    console.log("Successfully renamed table: editorspicks -> editors_picks");
  } catch (error) {
    console.error(
      "Failed to rename table: editorspicks -> editors_picks",
      error
    );
    throw error;
  }

  // 2) Rename columns on the devices table
  //    deviceType -> device_type
  //    expoPushToken -> expo_push_token
  //    isPushEnabled -> is_push_enabled
  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("deviceType", "device_type");
    });
    console.log("Successfully renamed column: deviceType -> device_type");
  } catch (error) {
    console.error("Failed to rename column: deviceType -> device_type", error);
    throw error;
  }

  // For expoPushToken, drop the dependent unique index first
  try {
    const dbType = knex.client.config.client;
    if (dbType === "sqlite3") {
      // SQLite syntax doesn't use ON table_name
      await knex.raw("DROP INDEX IF EXISTS devices_expopushtoken_unique");
    } else {
      // Other databases like PostgreSQL use ON table_name
      await knex.raw("DROP INDEX devices_expopushtoken_unique ON devices");
    }
    console.log("Dropped index: devices_expopushtoken_unique");
  } catch (error) {
    console.error(
      "Failed to drop index devices_expopushtoken_unique on devices",
      error
    );
    throw error;
  }

  // Rename expoPushToken -> expo_push_token
  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("expoPushToken", "expo_push_token");
    });
    console.log(
      "Successfully renamed column: expoPushToken -> expo_push_token"
    );
  } catch (error) {
    console.error(
      "Failed to rename column: expoPushToken -> expo_push_token",
      error
    );
    throw error;
  }

  // Recreate the index (if needed)
  try {
    await knex.raw(
      "CREATE UNIQUE INDEX devices_expo_push_token_unique ON devices(expo_push_token)"
    );
    console.log("Recreated unique index: devices_expo_push_token_unique");
  } catch (error) {
    console.error("Failed to recreate unique index on expo_push_token", error);
    throw error;
  }

  // Rename isPushEnabled -> is_push_enabled
  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("isPushEnabled", "is_push_enabled");
    });
    console.log(
      "Successfully renamed column: isPushEnabled -> is_push_enabled"
    );
  } catch (error) {
    console.error(
      "Failed to rename column: isPushEnabled -> is_push_enabled",
      error
    );
    throw error;
  }

  // 3) Rename isUid -> is_uid in notifications
  try {
    console.log("Renaming column: isUid -> is_uid in notifications");
    await knex.schema.alterTable("notifications", (table) => {
      table.renameColumn("isUid", "is_uid");
    });
    console.log("Successfully renamed column: isUid -> is_uid");
  } catch (error) {
    console.error("Failed to rename column: isUid -> is_uid", error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  // Reverse the renames

  // 1) Rename editors_picks -> editorspicks
  try {
    await knex.schema.renameTable("editors_picks", "editorspicks");
    console.log("Successfully renamed table: editors_picks -> editorspicks");
  } catch (error) {
    console.error(
      "Failed to rename table: editors_picks -> editorspicks",
      error
    );
    throw error;
  }

  // 2) Rename columns on the devices table back
  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("device_type", "deviceType");
    });
    console.log("Successfully renamed column: device_type -> deviceType");
  } catch (error) {
    console.error("Failed to rename column: device_type -> deviceType", error);
    throw error;
  }

  // Drop the index for expo_push_token before renaming it back
  try {
    const dbType = knex.client.config.client;
    if (dbType === "sqlite3") {
      // SQLite syntax doesn't use ON table_name
      await knex.raw("DROP INDEX IF EXISTS devices_expo_push_token_unique");
    } else {
      // Other databases like PostgreSQL use ON table_name
      await knex.raw("DROP INDEX devices_expo_push_token_unique ON devices");
    }
    console.log("Dropped index: devices_expo_push_token_unique");
  } catch (error) {
    console.error("Failed to drop index devices_expo_push_token_unique", error);
    throw error;
  }

  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("expo_push_token", "expoPushToken");
    });
    console.log(
      "Successfully renamed column: expo_push_token -> expoPushToken"
    );
  } catch (error) {
    console.error(
      "Failed to rename column: expo_push_token -> expoPushToken",
      error
    );
    throw error;
  }

  // Recreate the unique index for expoPushToken
  try {
    await knex.raw(
      "CREATE UNIQUE INDEX devices_expopushtoken_unique ON devices(expoPushToken)"
    );
    console.log("Recreated unique index: devices_expopushtoken_unique");
  } catch (error) {
    console.error("Failed to recreate unique index on expoPushToken", error);
    throw error;
  }

  try {
    await knex.schema.alterTable("devices", (table) => {
      table.renameColumn("is_push_enabled", "isPushEnabled");
    });
    console.log(
      "Successfully renamed column: is_push_enabled -> isPushEnabled"
    );
  } catch (error) {
    console.error(
      "Failed to rename column: is_push_enabled -> isPushEnabled",
      error
    );
    throw error;
  }

  // 3) Rename is_uid -> isUid in notifications
  try {
    await knex.schema.alterTable("notifications", (table) => {
      table.renameColumn("is_uid", "isUid");
    });
    console.log("Successfully renamed column: is_uid -> isUid");
  } catch (error) {
    console.error("Failed to rename column: is_uid -> isUid", error);
    throw error;
  }
}
