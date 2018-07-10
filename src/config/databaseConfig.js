import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

let dbConfig;
if (process.env.NODE_ENV === 'dev-test') {
  dbConfig = {
    user: process.env.DB_LOCAL_TEST_USER,
    host: process.env.DB_LOCAL_TEST_HOST,
    database: process.env.DB_LOCAL_TEST_DATABSE,
    password: process.env.DB_LOCAL_TEST_PASSWORD,
    port: process.env.DB_LOCAL_TEST_PORT,
  };
} else if (process.env.NODE_ENV === 'production') {
  dbConfig = { connectionString: process.env.DATABASE_URL };
} else if (process.env.NODE_ENV === 'test') {
  dbConfig = {
    user: process.env.DB_LOCAL_TRAVIS_USER,
    database: process.env.DB_LOCAL_TRAVIS_DATABSE,
    password: process.env.DB_LOCAL_TRAVIS_PASSWORD,
  };
} else {
  console.log('dev');
  dbConfig = {
    user: process.env.DB_LOCAL_USER,
    host: process.env.DB_LOCAL_HOST,
    database: process.env.DB_LOCAL_DATABSE,
    password: process.env.DB_LOCAL_PASSWORD,
    port: process.env.DB_LOCAL_PORT,
  };
}

const pool = new Pool(dbConfig);

export default pool;
