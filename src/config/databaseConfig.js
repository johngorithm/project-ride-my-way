import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

let dbConfig;
if (process.env.NODE_ENV === 'development') {
  console.log('dev');
  dbConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'ridemyway',
    password: 'neme7jo@',
    port: 5432,
  };
} else if (process.env.NODE_ENV === 'dev-test') {
  console.log('dev:test');
  dbConfig = {
    user: 'postgres',
    database: 'ridemyway_test',
    password: 'neme7jo@',
    port: 5432,
  };
} else if (process.env.NODE_ENV === 'production') {
  dbConfig = { connectionString: process.env.DATABASE_URL };
} else if (process.env.NODE_ENV === 'test') {
  console.log('TRAVIS TEST');
  dbConfig = {
    user: 'johngorithm',
    database: 'travis_ci_test',
    password: 'neme7jo@',
  };
}

const pool = new Pool(dbConfig);

export default pool;
