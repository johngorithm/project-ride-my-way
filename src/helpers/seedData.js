
import pool from '../config/databaseConfig';

const rideQuery = 'INSERT INTO rides (destination, time, date, take_off_venue,creator, creator_id, capacity, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
const userQuery = 'INSERT INTO users ( firstname, lastname, username, email, password ) VALUES ( $1, $2, $3, $4, $5) RETURNING *';
const requestQuery = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4) RETURNING *';


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
  ['Ikeja', '12:45 PM', '3/12/2018', 'Epic Tower', 'John', 1, 5, 'empty'],
  ['Lekki', '03:00 PM', '8/12/2018', 'Anthony bus terminal', 'Foo', 3, 5, 'empty'],
  ['Oja', '05:00 PM', '8/8/2018', 'Iyana Ipaja bus stop', 'Dera', 2, 1, 'empty'],
  ['Ikotun', '06:00 AM', '2/8/2018', 'Ikeja Along', 'Love', 6, 4, 'empty'],
  ['Sango', '04:00 AM', '2/8/2018', 'Ipaja bus stop', 'John', 1, 1, 'empty'],
];

const requests = [
  ['John', 1, 3, 'pending'],
  ['John', 1, 2, 'pending'],
  ['Dera', 2, 1, 'pending'],
  ['Dera', 2, 2, 'pending'],
  ['Love', 6, 3, 'pending'],
  ['Peace', 4, 2, 'pending'],
  ['Hetro', 5, 3, 'pending'],
  ['Keneth', 7, 4, 'pending'],
  ['Keneth', 7, 3, 'pending'],
  ['Henry', 8, 1, 'pending'],
];


class PopulateDB {
  static addUsers() {
    return pool.query(userQuery, users[0])
      .then(() => pool.query(userQuery, users[1]))
      .then(() => pool.query(userQuery, users[2]))
      .then(() => pool.query(userQuery, users[3]))
      .then(() => pool.query(userQuery, users[4]))
      .then(() => pool.query(userQuery, users[5]))
      .then(() => pool.query(userQuery, users[6]))
      .then(() => pool.query(userQuery, users[7]))
      .then(lastAddedUser => console.log(`All users added, ${lastAddedUser.rows[0].firstname} is the last user`))
      .catch(e => console.log(e.message));
  }

  static addRides() {
    return pool.query(rideQuery, rides[0])
      .then(() => pool.query(rideQuery, rides[1]))
      .then(() => pool.query(rideQuery, rides[2]))
      .then(() => pool.query(rideQuery, rides[3]))
      .then(() => pool.query(rideQuery, rides[4]))
      .then(lastAddedRide => console.log(`All rides added, Ride to ${lastAddedRide.rows[0].destination} is the last user`))
      .catch(e => console.log(e.message));
  }

  static addRequests() {
    return pool.query(requestQuery, requests[0])
      .then(() => pool.query(requestQuery, requests[1]))
      .then(() => pool.query(requestQuery, requests[2]))
      .then(() => pool.query(requestQuery, requests[3]))
      .then(() => pool.query(requestQuery, requests[4]))
      .then(() => pool.query(requestQuery, requests[5]))
      .then(() => pool.query(requestQuery, requests[6]))
      .then(() => pool.query(requestQuery, requests[7]))
      .then(() => pool.query(requestQuery, requests[8]))
      .then(lastAddedRequest => console.log(`All requests added, Request from ${lastAddedRequest.rows[0].sender} is the last user`))
      .catch(e => console.log(e.message));
  }
}

export default PopulateDB;
