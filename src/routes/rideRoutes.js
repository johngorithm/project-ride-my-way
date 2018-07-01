import express from 'express';
import { Rides, Users } from '../models/data';
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


rideRoutes.post('/', (req, res) => {
  const fieldErrors = {};
  const newRide = req.body;
  const {
    destination,
    date,
    time,
    takeOffVenue,
  } = newRide;
  let willSave = true;

  const validateRide = (fieldData, fieldName) => {
    if (typeof fieldData === 'string') {
      if (fieldData.trim() === '') {
        fieldErrors[fieldName] = `${fieldName} is required`;
        willSave = false;
      }
    } else if (fieldData === undefined) {
      fieldErrors[fieldName] = `${fieldName} is required`;
      willSave = false;
    }
  };

  validateRide(destination, 'destination');
  validateRide(time, 'time');
  validateRide(date, 'date');
  validateRide(takeOffVenue, 'takeOffVenue');


  if (willSave === true) {
    // ID of authenticated user posting this ride
    const creatorId = 1;
    pool.query('INSERT INTO rides (destination, time, date, take_of_venue, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [destination, time, date, takeOffVenue, creatorId], (rideError, createdRide) => {
      if (rideError) {
        res.status(500).json({
          message: 'Something went wrong, Ride could not be saved!',
          status: 'failure',
          ride: newRide,
          errors: rideError.message,
        });
      } else if (createdRide.rows[0]) {
        res.status(200).json({
          message: `You ride to ${createdRide.rows[0].destination} was successfully created`,
          status: true,
          ride: createdRide.rows[0],
        });
      }
    });
  } else {
    res.status(400).json({
      message: 'Required field(s) is/are missing',
      status: 'failure',
      data: newRide,
      errors: fieldErrors,
    });
  }
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

  const userId = 4;
  const rideDestination = 'Lekki';
  const sender = 'Dera';
  // FETCH SENDER FROM req.user.firstname
  // GRAB SENDER ID FROM req.user.id
  // FETCH RIDE DESTINATION req.params.destination
  const query = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
  const queryValues = [sender, userId, rideId, 'pending'];
  pool.query(query, queryValues, (error, newRequest) => {
    if (error) {
      res.status(500).json({
        message: 'Something went wrong, Ride cannot be fetched',
        status: false,
        error: 'Unable to fetch ride data',
      });
    } else if (newRequest.rows[0]) {
      res.status(200).json({
        message: `You request to join a ride to ${rideDestination} was successfully received, you will be notified when it has been accepted`,
        status: true,
        request: newRequest.rows[0],
      });
    }
  });
});

export default rideRoutes;
