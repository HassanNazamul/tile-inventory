import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Create MySQL connection using hardcoded credentials
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'inventory'
});

export const db = drizzle(connection);
