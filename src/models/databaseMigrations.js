import pool from '../config/databaseConfig';


const userTableQuery = `CREATE TABLE IF NOT EXISTS users(
  user_id serial PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50),
  username VARCHAR (50) UNIQUE NOT NULL,
  image_url VARCHAR,
  phone VARCHAR (20) UNIQUE NOT NULL,
  email VARCHAR (355) UNIQUE NOT NULL,
  password VARCHAR (400) NOT NULL,
  notifications JSON,
  created_on TIMESTAMP DEFAULT Now(),
  last_updated TIMESTAMP,
  last_login TIMESTAMP
)`;

const rideTableQuery = `CREATE TABLE IF NOT EXISTS rides (
  ride_id serial PRIMARY KEY,
  destination VARCHAR (100) NOT NULL,
  time TIME,
  date DATE,
  take_of_venue VARCHAR (200),
  creator VARCHAR (20),
  creator_id INTEGER REFERENCES users (user_id),
  created_on TIMESTAMP DEFAULT Now(),
  requests JSON
)`;

const requestTableQuery = `CREATE TABLE IF NOT EXISTS requests (
  request_id serial PRIMARY KEY,
  sender_id INTEGER REFERENCES users (user_id),
  ride_id INTEGER REFERENCES rides (ride_id),
  created_on TIMESTAMP DEFAULT Now(),
  status VARCHAR(10),
  sender VARCHAR(20) NOT NULL
)`;

pool.query(userTableQuery, (error, response) => {
  if (error) {
    console.error(error.stack);
  }
  console.log(response);
  pool.query(rideTableQuery, (error, res) => {
    if (error) {
      console.error(error.stack);
    }
    console.log(res);
    pool.query(requestTableQuery, (error, result) => {
      if (error) {
        console.error(error.stack);
      }
      console.log(result);
    });
  });
});
