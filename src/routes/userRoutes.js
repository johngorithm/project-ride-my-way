import express from 'express';
import pool from '../config/databaseConfig';


const userRouter = express.Router();

userRouter.post('/rides', (req, res) => {
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
    const creatorId = req.decode.user_id;
    const creator = req.decode.firstname;
    pool.query('INSERT INTO rides (destination, time, date, take_of_venue, creator_id, creator) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [destination, time, date, takeOffVenue, creatorId, creator], (rideError, createdRide) => {
      if (rideError) {
        res.status(500).json({
          message: 'Something went wrong, Ride could not be saved!',
          status: false,
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
      status: false,
      data: newRide,
      errors: fieldErrors,
    });
  }
});

userRouter.get('/rides/:rideId/requests', (req, res) => {
  const { rideId } = req.params;
  if (isNaN(Number(rideId))) {
    res.status(400).json({
      message: 'The identity of the ride entered is not valid',
      status: false,
      error: 'Invalid ride identity',
    });
    return;
  }
  pool.query('SELECT * FROM requests WHERE ride_id = $1', [rideId], (error, requests) => {
    if (error) {
      res.status(500).json({
        message: 'Something went wrong, Ride cannot be fetched',
        status: false,
        error: error.message,
      });
    } else if (requests.rows[0]) {
      res.status(200).json({
        message: 'Requests data retrieval was successful',
        status: true,
        requests: requests.rows,
      });
    } else {
      res.status(404).json({
        message: 'There are no requests for this ride in store',
        status: false,
        error: 'No Request Found!',
      });
    }
  });
});

userRouter.put('/rides/:rideId/requests/:requestId', (req, res) => {
  const { rideId, requestId } = req.params;
  const { action } = req.query;


  if ((!action === 'accept') || (!action === 'reject')) {
    res.status(400).json({
      message: 'There is no valid action to be executed in your query',
      status: false,
      error: 'Invalid update action',
    });
  } else if (action) {
    pool.query('UPDATE requests SET status = $1 WHERE request_id = $2 AND ride_id = $3 RETURNING *', [`${action}ed`, requestId, rideId], (error, updatedRequest) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Request could not be updated!',
          status: false,
          errors: error.message,
        });
      } else if (updatedRequest.rows[0]) {
        // send notification to the request owner
        res.status(200).json({
          message: 'Request data was successfully updated',
          status: true,
          ride: updatedRequest.rows[0],
        });
      } else {
        res.status(400).json({
          message: 'This is request is not found',
          status: false,
          errors: 'Request Not Found',
        });
      }
    });
  }
});

export default userRouter;
