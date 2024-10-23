// Update with your config settings.

import { Knex } from "knex";
import env from "./data/env";

const rootDir = process.cwd(); // Get the absolute path of the root directory
console.log(rootDir);
// if rootDir is db, then use dist/dev.sqlite3
// if rootDir is nms, then use db/dist/dev.sqlite3
// (since db is nested under nms)
const startPath = rootDir.endsWith("db") ? "../" : "";
console.log("env in db", env.ENV);
const config: { [key: string]: Knex.Config } = {
  test: {
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
    client: "pg",
    connection: env.DB_URL,
    pool: {
      min: 2,
      max: 20,
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
      host: env.DB_URL,
      port: 1433,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD, 
      options: {
        encrypt: true
      }
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  }
};

export default config;
