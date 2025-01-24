import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1) Rename editorspicks -> editors_picks
  await knex.schema.renameTable("editorspicks", "editors_picks");

  // 2) Rename columns on the devices table
  //    deviceType -> device_type
  //    expoPushToken -> expo_push_token
  //    isPushEnabled -> is_push_enabled
  await knex.schema.alterTable("devices", (table) => {
    table.renameColumn("deviceType", "device_type");
    table.renameColumn("expoPushToken", "expo_push_token");
    table.renameColumn("isPushEnabled", "is_push_enabled");
  });

  // 3) Rename isUid -> is_uid in notifications
  await knex.schema.alterTable("notifications", (table) => {
    table.renameColumn("isUid", "is_uid");
  });
}

export async function down(knex: Knex): Promise<void> {
  // Reverse the renames

  // 1) Rename editors_picks -> editorspicks
  await knex.schema.renameTable("editors_picks", "editorspicks");

  // 2) Rename columns on the devices table back
  await knex.schema.alterTable("devices", (table) => {
    table.renameColumn("device_type", "deviceType");
    table.renameColumn("expo_push_token", "expoPushToken");
    table.renameColumn("is_push_enabled", "isPushEnabled");
  });

  // 3) Rename is_uid -> isUid
  await knex.schema.alterTable("notifications", (table) => {
    table.renameColumn("is_uid", "isUid");
  });
}
