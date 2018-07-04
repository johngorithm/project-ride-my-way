import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

let dbConfig;
if (process.env.NODE_ENV === 'development') {
  dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'ridemyway',
    password: 'neme7jo@',
    port: 5432,
  };
} else if (process.env.NODE_ENV === 'test') {
  dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'ridemyway_test',
    password: 'neme7jo@',
    port: 5432,
  };
} else if (process.env.NODE_ENV === 'production') {
  dbConfig = { connectionString: process.env.DATABASE_URL };
}

console.log(process.env.NODE_ENV);

const pool = new Pool(dbConfig);

export default pool;
