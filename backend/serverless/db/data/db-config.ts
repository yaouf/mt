import knex from 'knex';
import config from '../knexfile';
function outerDb(params: Record<string, string>) {
    const { environment, dbUrl } = params;
    return knex(config(dbUrl)[environment || "development"]);
}
export default outerDb;

