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
  await knex.schema.alterTable("devices", async (table) => {
    try {
      table.renameColumn("deviceType", "device_type");
      console.log("Successfully renamed column: deviceType -> device_type");
    } catch (error) {
      console.error(
        "Failed to rename column: deviceType -> device_type",
        error
      );
      throw error;
    }

    try {
      table.renameColumn("expoPushToken", "expo_push_token");
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

    try {
      table.renameColumn("isPushEnabled", "is_push_enabled");
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
  });

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
  await knex.schema.alterTable("devices", async (table) => {
    try {
      table.renameColumn("device_type", "deviceType");
      console.log("Successfully renamed column: device_type -> deviceType");
    } catch (error) {
      console.error(
        "Failed to rename column: device_type -> deviceType",
        error
      );
      throw error;
    }

    try {
      table.renameColumn("expo_push_token", "expoPushToken");
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

    try {
      table.renameColumn("is_push_enabled", "isPushEnabled");
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
  });

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
