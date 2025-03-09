export default {
    out: "./drizzle/migrations",
    schema: "./src/db/schema.ts",
    dialect: process.env.DB_DIALECT || 'mysql',
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_DATABASE || "test",
    },
};