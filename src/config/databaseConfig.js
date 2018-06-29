import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ridemyway',
  password: 'neme7jo@',
  port: 5432,
});


export default pool;
