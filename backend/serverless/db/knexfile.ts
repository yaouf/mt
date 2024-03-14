// Update with your config settings.

import { Knex } from "knex";

const rootDir = process.cwd(); // Get the absolute path of the root directory
console.log(rootDir);
// if rootDir is db, then use dist/dev.sqlite3
// if rootDir is nms, then use db/dist/dev.sqlite3
// (since db is nested under nms)
const startPath = rootDir.endsWith("db") ? "" : "../db/";
console.log("full path: ", startPath + "dist/dev.sqlite3");
const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename:
        startPath + "dist/dev.sqlite3",
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
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
