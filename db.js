import pkg from 'pg';
import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();
const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'todo_db',
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL successfully.');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});