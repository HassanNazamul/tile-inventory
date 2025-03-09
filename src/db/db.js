import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Create MySQL connection
const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'test',
});

export const db = drizzle(connection);
