import knex from 'knex';
import config from '../knexfile';
import env from './env';
console.log("env in db-config", env.ENV);
const db = knex(config[env.ENV]);

export default db;

