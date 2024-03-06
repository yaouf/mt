
## Steps for Modifying the Database Schema

If you want to modify the database schema, there are two options: you can either edit the migration file or create a new migration file.

If you want to update the existing migration file:

1. Go to the db folder in integrated terminal.
2. Run `npx ts-node node_modules/.bin/knex migrate:rollback` to undo the last migration.
3. Run `npx ts-node node_modules/.bin/knex migrate:latest` to update to the latest migration file.
4. Run `npx ts-node node_modules/.bin/knex seed:run` to populate the database tables with sample data.
5. Go to functions folder in integrated terminal.
6. Run `npm run dev` to start the server and watch for changes.

If you create a new file:

1. Go to db folder in integrated terminal. 
2. Create a new migration with: `npx ts-node node_modules/.bin/knex migrate:make migration_name-update` in the migrations folder.
3. Update the seed file in the seeds folder, if you would like.
4. Run `npx ts-node node_modules/.bin/knex migrate:latest` to update to the latest migration file.
5. Run `npx ts-node node_modules/.bin/knex seed:run` to populate the database tables with sample data.
6. Go to functions folder in integrated terminal.
7. Run `npm run dev` to start the server and watch for changes.
