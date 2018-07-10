
import pool from '../config/databaseConfig';


class RideController {
  static getAllRides(req, res) {
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
  }

  static getSingleRide(req, res) {
    const { rideId } = req.params;

    const query = 'SELECT * FROM rides WHERE ride_id = $1';
    pool.query(query, [rideId], (error, requestedRide) => {
      if (error) {
        if (error.code === '23503') {
          res.status(400).json({
            message: 'The Ride you are requesting does NOT exist',
            status: false,
            error: error.message,
          });
        } else if (error.code === '22P02') {
          res.status(400).json({
            message: 'The ride ID of this request is invalid',
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
  }

  static postRideRequest(req, res) {
    const { rideId } = req.params;
    const userId = req.decode.user_id;
    const sender = req.decode.firstname;

    const query = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4) RETURNING sender,sender_id, ride_id, status';
    const queryValues = [sender, userId, rideId, 'pending'];

    pool.query(query, queryValues, (error, newRequest) => {
      if (error) {
        if (error.code === '23503') {
          res.status(400).json({
            message: 'You are requesting to join a ride that does not exist',
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
      } else if (newRequest.rows[0]) {
        res.status(200).json({
          message: 'Your request was successfully received, keep an eye on your notification to know the status of your request',
          status: true,
          request: newRequest.rows[0],
        });
      }
    });
  }
}


export default RideController;
