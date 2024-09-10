import knex from 'knex';
import config from '../knexfile';
import env from './env';
console.log("env", env.NODE_ENV);
const db = knex(config[env.NODE_ENV]);

export default db;

