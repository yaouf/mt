// Update with your config settings.

import "dotenv/config";
import { Knex } from "knex";
const rootDir = process.cwd(); // Get the absolute path of the root directory
console.log(rootDir);
// import { defineString } from "firebase-functions/params";
// console.log("DB_URL: ", defineString("DB_URL").value());
// if rootDir is db, then use dist/dev.sqlite3
// if rootDir is nms, then use db/dist/dev.sqlite3
// (since db is nested under nms)
const startPath = rootDir.endsWith("db") ? "" : "../db/";
console.log("full path: ", startPath + "dist/dev.sqlite3");
function configFunc(dbUrl: string) {
  // TODO: use env var package for validation.
  if (!dbUrl) {
    dbUrl = process.env.DB_URL || "";
  }
  const config: { [key: string]: Knex.Config<string> } = {
    development: {
      client: "sqlite3",
      connection: {
        filename: startPath + "dist/dev.sqlite3",
      },
      useNullAsDefault: true,
      seeds: {
        directory: "./data/seeds",
      },
      migrations: {
        directory: "./data/migrations",
      },
    },

    staging: {
      client: "pg",
      connection: dbUrl,
      pool: {
        min: 0, // Start with no connections
        max: 1, // Maximum one connection per instance
        idleTimeoutMillis: 10000, // Close idle connections after 5 seconds
        acquireTimeoutMillis: 30000, // Timeout after 5 seconds if a connection cannot be acquired
      },
      migrations: {
        directory: "./data/migrations",
      },
      seeds: {
        directory: "./data/seeds",
      },
    },
    production: {
      client: "mssql",
      connection: {
        host: dbUrl,
        port: 1433,
        database: process.env.DB_NAME || "",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        options: {
          encrypt: true,
        },
      },
      pool: {
        min: 0, // Start with no connections
        max: 1, // Maximum one connection per instance
        idleTimeoutMillis: 10000, // Close idle connections after 5 seconds
        acquireTimeoutMillis: 30000, // Timeout after 5 seconds if a connection cannot be acquired
      },
      migrations: {
        directory: "./data/migrations",
      },
      seeds: {
        directory: "./data/seeds",
      },
    },
  };
  return config;
}

export default configFunc;
