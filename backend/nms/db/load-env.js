const dotenv = require('dotenv');
const fs = require('fs');

// Load the base .env file
const res = dotenv.config({ path: '.env' });
console.log("config result", res);
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
