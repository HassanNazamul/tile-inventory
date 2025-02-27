// import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    out: './drizzle/migrations',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'inventory'
    }
});
