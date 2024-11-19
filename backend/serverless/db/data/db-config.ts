import knex from 'knex';
import config from '../knexfile';
function outerDb(params: Record<string, string>) {
    const { environment, dbUrl } = params;
    const db = knex(config(dbUrl)[environment || "development"]);
    return db;
}
export default outerDb;

