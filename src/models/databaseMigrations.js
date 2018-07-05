import pool from '../config/databaseConfig';
import PopulateDB from '../helpers/seedData';


const userTableQuery = `CREATE TABLE IF NOT EXISTS users(
  user_id serial PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50),
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
  take_of_venue VARCHAR (200),
  creator VARCHAR (20),
  creator_id INTEGER REFERENCES users (user_id),
  created_on TIMESTAMP DEFAULT Now()
)`;

const requestTableQuery = `CREATE TABLE IF NOT EXISTS requests (
  request_id serial PRIMARY KEY,
  sender_id INTEGER REFERENCES users (user_id),
  ride_id INTEGER REFERENCES rides (ride_id),
  created_on TIMESTAMP DEFAULT Now(),
  status VARCHAR(10),
  sender VARCHAR(20) NOT NULL
)`;


pool.query('DROP TABLE IF EXISTS users CASCADE', (userTableDelError, res) => {
  if (userTableDelError) {
    console.log(userTableDelError.message);
  }
  pool.query('DROP TABLE IF EXISTS rides CASCADE', (rideTableDelError, rideResponse) => {
    if (rideTableDelError) {
      console.log(rideTableDelError.message);
    }

    pool.query('DROP TABLE IF EXISTS requests CASCADE', (requestTableDelError, reqResponse) => {
      if (requestTableDelError) {
        console.log(requestTableDelError.message);
      }
      console.log('done deleting');
      pool.query(userTableQuery, (error, response) => {
        if (error) {
          console.error(error.message);
        }
        PopulateDB.addUsers();
        console.log('next');
        pool.query(rideTableQuery, (error, res) => {
          if (error) {
            console.error(error.message);
          }
          PopulateDB.addRides();
          console.log('next');
          pool.query(requestTableQuery, (error, result) => {
            if (error) {
              console.error(error.message);
            }
            PopulateDB.addRequests();
            console.log('done');
          });
        });
      });
    });
  });
});
