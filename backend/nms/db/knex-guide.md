# Knex Guide

Knex is a ORM for SQL, and allows you to write and execute queries in Node (among other language runtimes).

## Seeds

## [Migrations](https://knexjs.org/guide/migrations.html)

Migrations allow you to update the schema of your database using the ORM instead of raw SQL.

To see all migrations: `npm run knex -- migrate:list`

### **To create and execute a migration:**

1. Enter `nms/db` folder from CLI
2. `npm run knex -- migrate:make <migration_name> -x ts`
    1. `-x ts` designates to run it in TS
    2. npm run knex is a proxy script in `package.json` for running knex in db folder. `--` designates passing arguments to secondary (inner) script.
    3. Do this for each migration you want to make.
3. Edit the files for each migration in the `db/data` folder. The format of the file is `timestamp_migration-name.ts`
    1. Follow examples already there to see options, else ChatGPT can help.
4. Edit any corresponding seed files to ensure they work with the new migration.
5. When done, we are ready to deploy. Make sure you are in the proper db environment. If you want to make the change for the staging db, run it locally, and if production, run it on the nms azure db with the proper env variables (use [NMS Guide](https://www.notion.so/NMS-Guide-10e0afbd966a80c4813fc089c331d5c2?pvs=21) to connect).  
6. Temporarily change the `NODE_ENV` env variable to match the `ENV` env variable in the `.env` file, since knex will by default use the former for migrations even when explicitly told to use the latter.
7. You can find the list of migrations by running `npm run knex -- migrate:list`
8. Now you have two options: run each migration individually, or run them all at once.
    1. Individually: `npm run knex -- migrate:up` to run the next not yet run migration.
        1. To revert: `npm run knex -- migrate:down`
        2. You can also run `npm run knex -- migrate:up <migration_name>` where migration name is found from `migrate:list` to run specific migrations out of order. To revert run the same but with down instead of up.
    2. Together: `npm run knex -- migrate:latest` to run all next not yet run migrations.  
        1. To revert: `npm run knex -- migrate:rollback`
9. When done, change the `NODE_ENV` env variable back to what it was if changed.
