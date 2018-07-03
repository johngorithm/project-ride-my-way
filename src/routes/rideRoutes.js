import express from 'express';
import pool from '../config/databaseConfig';

const rideRoutes = express.Router();

rideRoutes.get('/', (req, res) => {
  const query = 'SELECT * FROM rides';
  pool.query(query, (error, returnedRides) => {
    if (error) {
      res.status(500).json({
        message: 'Something went wrong, Ride cannot be fetched',
        status: false,
        error: 'Unable to fetch ride data',
      });
    } else if (returnedRides.rows[0]) {
      res.status(200).json({
        message: 'All rides retrieved successfully',
        status: true,
        rides: returnedRides.rows,
      });
    } else {
      res.status(404).json({
        message: 'The database has no ride offer stored',
        status: false,
        error: 'Rides Not Found!',
      });
    }
  });
});


rideRoutes.get('/:rideId', (req, res) => {
  const { rideId } = req.params;
  if (isNaN(Number(rideId))) {
    res.status(400).json({
      message: 'The identity of the ride entered is not valid',
      status: false,
      error: 'Invalid ride identity',
    });
    return;
  }

  const query = 'SELECT * FROM rides WHERE ride_id = $1';
  pool.query(query, [rideId], (error, requestedRide) => {
    if (error) {
      res.status(500).json({
        message: 'Something went wrong, Ride cannot be fetched',
        status: false,
        error: 'Unable to fetch ride data',
      });
    } else if (requestedRide.rows[0]) {
      res.status(200).json({
        message: 'Ride data retrieval was successful',
        status: true,
        ride: requestedRide.rows[0],
      });
    } else {
      res.status(404).json({
        message: 'This ride offer does not exist or may have been deleted',
        status: false,
        error: 'Ride Not Found!',
      });
    }
  });
});


rideRoutes.post('/:rideId/requests', (req, res) => {
  const { rideId } = req.params;
  if (isNaN(Number(rideId))) {
    res.status(400).json({
      message: 'The identity of the ride you want to join is not valid',
      status: false,
      error: 'Invalid ride identity',
    });
    return;
  }

  const userId = req.decode.user_id;
  const sender = req.decode.firstname;
  // FETCH RIDE DESTINATION req.params.destination
  const query = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
  const queryValues = [sender, userId, rideId, 'pending'];
  pool.query(query, queryValues, (error, newRequest) => {
    if (error) {
      if (error.code == '23503') {
        res.status(404).json({
          message: 'You are requesting to join a ride that does not exist',
          status: false,
          error: error.message,
        });
        return;
      }
      res.status(500).json({
        message: 'Something went wrong, Ride cannot be fetched',
        status: false,
        error: error.message,
      });
    } else if (newRequest.rows[0]) {
      res.status(200).json({
        message: 'Your request was successfully received, keep an eye on your notification to know the status of your request',
        status: true,
        request: newRequest.rows[0],
      });
    }
  });
});

export default rideRoutes;
