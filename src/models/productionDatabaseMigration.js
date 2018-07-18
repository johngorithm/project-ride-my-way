import pool from '../config/databaseConfig';


const userTableQuery = `CREATE TABLE IF NOT EXISTS users(
  user_id serial PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL,
  username VARCHAR (50) UNIQUE NOT NULL,
  image_url VARCHAR,
  email VARCHAR (355) UNIQUE NOT NULL,
  password VARCHAR (400) NOT NULL,
  created_on TIMESTAMP DEFAULT Now(),
  last_updated TIMESTAMP,
  last_login TIMESTAMP
)`;

const rideTableQuery = `CREATE TABLE IF NOT EXISTS rides (
  ride_id serial PRIMARY KEY,
  destination VARCHAR (100) NOT NULL,
  time TIME,
  date DATE,
  take_off_venue VARCHAR (200),
  capacity INTEGER NOT NULL,
  space_occupied INTEGER DEFAULT 0,
  status VARCHAR (10) CHECK (status IN ('vacant', 'filled', 'empty')),
  creator VARCHAR (20) NOT NULL,
  creator_id INTEGER REFERENCES users (user_id),
  created_on TIMESTAMP DEFAULT Now()
)`;

const requestTableQuery = `CREATE TABLE IF NOT EXISTS requests (
  request_id serial PRIMARY KEY,
  sender_id INTEGER REFERENCES users (user_id),
  ride_id INTEGER REFERENCES rides (ride_id),
  created_on TIMESTAMP DEFAULT Now(),
  status VARCHAR(10)  CHECK (status IN ('pending', 'accepted', 'rejected')),
  sender VARCHAR(20) NOT NULL
)`;

const notifyTableQuery = `CREATE TABLE IF NOT EXISTS notifications (
notification_id SERIAL PRIMARY KEY,
messages TEXT NOT NULL,
sender_id INTEGER REFERENCES users (user_id) NOT NULL,
sender VARCHAR (50) NOT NULL,
receiver_id INTEGER REFERENCES users (user_id)  NOT NULL,
received_on TIMESTAMP DEFAULT Now()
)`;


pool.query('DROP TABLE IF EXISTS users CASCADE')
  .then(() => pool.query('DROP TABLE IF EXISTS rides CASCADE'))
  .then(() => pool.query('DROP TABLE IF EXISTS requests CASCADE'))
  .then(() => pool.query('DROP TABLE IF EXISTS notifications CASCADE'))
  .then(() => pool.query(userTableQuery))
  .then(() => pool.query(rideTableQuery))
  .then(() => pool.query(requestTableQuery))
  .then(() => pool.query(notifyTableQuery))
  .then(() => console.log('All Done'))
  .catch(e => console.log(e.message));
