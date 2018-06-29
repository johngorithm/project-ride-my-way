import pool from '../config/databaseConfig';


const userTableQuery = `CREATE TABLE IF NOT EXISTS users(
 user_id serial PRIMARY KEY,
 username VARCHAR (50) UNIQUE NOT NULL,
 image_url VARCHAR,
 phone VARCHAR (20) UNIQUE NOT NULL,
 email VARCHAR (355) UNIQUE NOT NULL,
 password VARCHAR (400) NOT NULL,
 notifications JSON,
 created_on TIMESTAMP NOT NULL,
 last_updated TIMESTAMP,
 last_login TIMESTAMP
)`;

const rideTableQuery = `CREATE TABLE IF NOT EXISTS ride (
  ride_id serial PRIMARY KEY,
  destination VARCHAR (100) NOT NULL,
  time TIME,
  date DATE,
  take_of_venue VARCHAR (200),
  user_id INT NOT NULL,
  status VARCHAR(10),
  creator_id INTEGER REFERENCES users (user_id),
  requests JSON

)`;

pool.query(userTableQuery, (error, response) => {
  if (error) {
    console.error(error.stack);
  }
  console.log(response);
  pool.query(rideTableQuery, (error, response) => {
    if (error) {
      console.error(error.stack);
    }
    console.log(response);
  });
});
