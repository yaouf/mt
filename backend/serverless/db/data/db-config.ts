import knex from "knex";
import config from "../knexfile";
import env from "./env";
const envValue = env.ENV;
console.log("env in db-config", envValue);
const dbUrl = env.DB_URL;
console.log("dbUrl in db-config", dbUrl);
const fullConfig = config(dbUrl);
console.log("configOptions in db-config", fullConfig);
const currentConfig = fullConfig[envValue as keyof typeof config];
console.log("currentConfig in db-config", currentConfig);
const db = knex(currentConfig);

export default db;
