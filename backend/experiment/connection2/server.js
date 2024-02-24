// const knex = require("knex")({
//   client: "sqlite3",
//   connection: {
//     filename: "./data.db",
//   },
// });

import knex from "knex";
const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./data.db",
    },
    useNullAsDefault: true,
})

try {
  // Create a table
//   await knex.schema
//     .createTable("users", table => {
//       table.increments("id");
//       table.string("user_name");
//     })
//     // ...and another
//     .createTable("accounts", table => {
//       table.increments("id");
//       table.string("account_name");
//       table.integer("user_id").unsigned().references("users.id");
//     });
    await db.schema.createTable("devices", table => {
      table.increments("id").primary(); // Assuming 'id' as the primary key
      table.string("deviceType").notNullable();
      table.boolean("breakingNewsAlerts").notNullable();
      table.boolean("weeklySummaryAlerts").notNullable();
      table.string("expoPushToken").unique(); // Assuming 'expoPushToken' should be unique
    });
  // Then query the table...

  const insertedRows = await db("devices").insert({ deviceId: 1, deviceType: 'Phone', breakingNewsAlerts: true, weeklySummaryAlerts: false, expoPushToken: 'ExpoToken123' });

  console.log(insertedRows);

  // ...and using the insert id, insert into the other table.
//   await knex("accounts").insert({
//     account_name: "knex",
//     user_id: insertedRows[0],
//   });

  // Query both of the rows.
//   const selectedRows = await knex("users")
//     .join("accounts", "users.id", "accounts.user_id")
//     .select("users.user_name as user", "accounts.account_name as account");

  // map over the results
  const enrichedRows = insertedRows.map(row => ({ ...row, active: true }));
  // select all from devices table and log result
    const allDevices = await db("devices").select();
    console.log(allDevices);
  // Finally, add a catch statement
} catch (e) {
  console.error(e);
}
