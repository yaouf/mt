# Backend

## Instructions for Backend Development

1. Download Visual Studio Code and recommended workspace extensions.
2. Open command prompt using `Ctrl + ~` and run `npm run dev` to install dependencies, start the server.
3. Use Source Control to commit changes and push to GitHub. See [Git Best Practices](git-best-practices.md) for more information on branching and merging.

## Steps for Setting Up the Database

[Source](https://medium.com/@MajikMan/starting-a-node-project-from-scratch-with-sqlite3-knex-and-express-fb4b765aca)

The database is managed using Knex, which is a ORM for SQL databases. The development database used is SQLite3, which is a file-based database. The database is stored in the `dev.sqlite3` file in the functions folder once the database is created, which you can do by following the steps below:

1. Go to functions folder.
2. Run `npx ts-node node_modules/.bin/knex migrate:latest` to create the database tables.
3. Run `npx ts-node node_modules/.bin/knex seed:run` to populate the database tables with sample data.
4. Run `npm run dev` to start the server and watch for changes.

## Steps for Modifying the Database Schema

If you want to modify the database schema, there are two options: you can either edit the migration file or create a new migration file.

If you create a new file:

1. Go to functions folder.
2. Create a new migration with: `npx ts-node node_modules/.bin/knex migrate:make migration_name-update` in the migrations folder.
3. Update the seed file in the seeds folder, if you would like.
4. Run `npx ts-node node_modules/.bin/knex migrate:latest` to update to the latest migration file.
5. Run `npx ts-node node_modules/.bin/knex seed:run` to populate the database tables with sample data.
6. Run `npm run dev` to start the server and watch for changes.

If you want to update the existing migration file:

1. Go to the functions folder.
2. Run `npx ts-node node_modules/.bin/knex migrate:rollback` to undo the last migration.
3. Run `npx ts-node node_modules/.bin/knex migrate:latest` to update to the latest migration file.
4. Run `npx ts-node node_modules/.bin/knex seed:run` to populate the database tables with sample data.
5. Run `npm run dev` to start the server and watch for changes.
