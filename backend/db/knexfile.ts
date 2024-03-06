// Update with your config settings.

import { Knex } from "knex";

// TODO: if updating this, change filename to ./dev.sqlite3, then run changes specified in README.md, then change filename back to ../../db/dev.sqlite3

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "../../db/dev.sqlite3",
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
