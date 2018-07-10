
import pool from '../config/databaseConfig';


class UserController {
  static createRideOffer(req, res) {
    const {
      destination, time, date, takeOffVenue,
    } = req.body;
    // ID of authenticated user posting this ride
    const creatorId = req.decode.user_id;
    const creator = req.decode.firstname;
    pool.query('INSERT INTO rides (destination, time, date, take_of_venue, creator_id, creator) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [destination, time, date, takeOffVenue, creatorId, creator], (rideError, createdRide) => {
      if (rideError) {
        res.status(500).json({
          message: 'Something went wrong, Ride could not be saved!',
          status: false,
          ride: req.body,
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
  }

  static getAllRequestsForSpecificRide(req, res) {
    const { rideId } = req.params;

    pool.query('SELECT * FROM requests WHERE ride_id = $1', [rideId], (error, requests) => {
      if (error) {
        if (error.code === '23503') {
          res.status(400).json({
            message: 'The ride in this request does not exist',
            status: false,
            error: error.message,
          });
        } else if (error.code === '22P02') {
          res.status(400).json({
            message: 'The ID of the ride in this request is invalid',
            status: false,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Something went wrong, Ride cannot be fetched',
            status: false,
            error: error.code,
          });
        }
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
  }

  static acceptOrRejectRideRequest(req, res) {
    const { rideId, requestId } = req.params;
    const { action } = req.query;


    if (action.toLowerCase() === 'accept' || action.toLowerCase() === 'reject') {
      pool.query('UPDATE requests SET status = $1 WHERE request_id = $2 AND ride_id = $3 RETURNING *', [`${action.toLowerCase()}ed`, requestId, rideId], (error, updatedRequest) => {
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
    } else {
      res.status(403).json({
        message: 'Your action query is invalid or not specified',
        status: false,
        error: 'Invalid update action',
      });
    }
  }
}

export default UserController;
