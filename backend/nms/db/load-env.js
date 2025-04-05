/**
 * This script loads environment variables from .env files and runs Knex commands.
 * It first loads the base .env file, then checks for an environment-specific file
 * (e.g. .env.development or .env.staging) and loads that if it exists.
 * Finally, it executes the Knex command with any provided arguments.
 *
 * Usage: node load-env.js [knex arguments]
 * Example: node load-env.js migrate:latest
 * Alias (see package.json): npm run knex [knex arguments]
 */

const dotenv = require('dotenv');
const fs = require('fs');

// Load the base .env file
const res = dotenv.config({ path: '.env' });
console.log('config result', res);
// Get the ENV value
const env = process.env.ENV || 'development';
console.log(`ENV is set to ${env}`);

// Load the corresponding .env.<ENV> file if it exists
const envFilePath = `.env.${env}`;
if (fs.existsSync(envFilePath)) {
  console.log(`Loading environment-specific file: ${envFilePath}`);
  dotenv.config({ path: envFilePath });
} else {
  console.log(`Environment-specific file not found: ${envFilePath}`);
}

// Pass the remaining arguments to the Knex command
const { execSync } = require('child_process');
const args = process.argv.slice(2).join(' ');
execSync(`npx knex ${args}`, { stdio: 'inherit' });
