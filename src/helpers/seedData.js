
import pool from '../config/databaseConfig';

const rideQuery = 'INSERT INTO rides (destination, time, date, take_of_venue,creator, creator_id) VALUES ($1, $2, $3, $4, $5, $6)';
const userQuery = 'INSERT INTO users ( firstname, lastname, username, email, password ) VALUES ( $1, $2, $3, $4, $5)';
const requestQuery = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4)';


const users = [
  ['John', 'Obi', 'johngorithm', 'jo@me.com', 'neme'],
  ['Dera', 'Obi', 'deraviv', 'dera@me.com', 'neme'],
  ['Foo', 'Bar', 'bar', 'bar@me.com', 'neme'],
  ['Peace', 'Nwachukwu', 'peace', 'peace@me.com', 'neme'],
  ['Hetro', 'Mo', 'mo', 'jet@me.com', 'neme'],
  ['Love', 'Ana', 'love', 'love@me.com', 'neme'],
  ['Keneth', 'Gbenga', 'ken', 'ken@me.com', 'neme'],
  ['Henry', 'Obi', 'henry', 'nkams@me.com', 'neme'],
];

const rides = [
  ['Ikeja', '12:45 PM', '3/12/2018', 'Epic Tower', 'John', 1],
  ['Lekki', '03:00 PM', '8/12/2018', 'Anthony bus terminal', 'Foo', 3],
  ['Oja', '05:00 PM', '8/8/2018', 'Iyana Ipaja bus stop', 'Dera', 2],
  ['Ikotun', '06:00 AM', '2/8/2018', 'Ikeja Along', 'Foo', 3],
  ['Sango', '04:00 AM', '2/8/2018', 'Ipaja bus stop', 'John', 1],
];

const requests = [
  ['John', 1, 1, 'pending'],
  ['Dera', 2, 1, 'pending'],
  ['Keneth', 7, 2, 'pending'],
  ['Henry', 8, 3, 'pending'],
  ['Foo', 3, 4, 'pending'],
  ['Peace', 4, 5, 'pending'],
];


class PopulateDB {
  static addUsers() {
    users.forEach((user) => {
      pool.query(userQuery, user, (userError, newUser) => {
        if (userError) {
          console.log(userError.message);
        }
      });
    });
  }

  static addRides() {
    rides.forEach((ride) => {
      pool.query(rideQuery, ride, (rideError, addedRide) => {
        if (rideError) {
          console.log(rideError.message);
        }
      });
    });
  }

  static addRequests() {
    requests.forEach((request) => {
      pool.query(requestQuery, request, (requestError, newRequest) => {
        if (requestError) {
          console.log(requestError.message);
        }
      });
    });
  }
}

export default PopulateDB;
