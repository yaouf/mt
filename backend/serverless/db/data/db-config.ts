import knex from 'knex';
import config from '../knexfile'
function outerDb(params: Record<string, string>) {
    const { environment, stagingDbUrl } = params;
    return knex(config(stagingDbUrl)[environment || "development"]);
}
export default outerDb;

