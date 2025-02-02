import knex from "knex";
import envars from "../envars";

// Initialize knex with a single connection pool
const db = knex({
  client: "pg",
  connection: {
    connectionString: envars.dbUrl.value(),
    ssl:
      envars.environment.value() === "production"
        ? { rejectUnauthorized: false }
        : false,
    database: envars.dbName.value(),
    user: envars.dbUser.value(),
    password: envars.dbPassword.value(),
  },
  pool: {
    min: 0,
    max: 7, // Keep pool size reasonable for serverless
  },
});

// Add event listeners for the connection pool
db.on("query-error", (error: Error) => {
  console.error("Database query error:", error);
});

db.on("error", (error: Error) => {
  console.error("Database connection error:", error);
});

export default db;
