
import pool from '../config/databaseConfig';


class RideController {
  static getAllRides(req, res) {
    const query = 'SELECT * FROM rides ORDER BY ride_id DESC';
    pool.query(query, (error, returnedRides) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to fetch rides',
          status: false,
          error: 'Unable To Fetch Ride Offers',
        });
      } else if (returnedRides.rows[0]) {
        res.status(200).json({
          message: 'Rides retrieved successfully',
          status: true,
          rides: returnedRides.rows,
        });
      } else {
        res.status(404).json({
          message: 'The database has no ride offer stored',
          status: false,
          error: 'Ride Not Found!',
        });
      }
    });
  }

  static getSingleRide(req, res) {
    const { rideId } = req.params;

    const query = 'SELECT * FROM rides WHERE ride_id = $1';
    pool.query(query, [rideId], (error, requestedRide) => {
      if (error) {
        if (error.code === '22P02') {
          res.status(400).json({
            message: 'The ride ID of this request is invalid',
            status: false,
            error: 'Invalid Ride ID',
          });
        } else {
          res.status(500).json({
            message: 'Something went wrong, Unable to fetch',
            status: false,
            error: error.message,
          });
        }
      } else if (requestedRide.rows[0]) {
        res.status(200).json({
          message: 'Ride offer retrieved successfully',
          status: true,
          ride: requestedRide.rows[0],
        });
      } else {
        res.status(404).json({
          message: 'Ride offer does not exist or has been deleted',
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


    // FETCH THE RIDE IN QUESTION FROM DB
    pool.query('SELECT * FROM rides WHERE ride_id = $1', [rideId], (error, ride) => {
      if (error) {
        if (error.code === '22P02') {
          res.status(400).json({
            message: 'Your request contains invalid ride ID',
            status: false,
            error: 'Invalid Ride ID',
          });
        } else {
          res.status(500).json({
            message: 'Something went wrong, Unable to fetch ride',
            status: false,
            error: error.message,
          });
        }
      } else if (ride.rows[0]) {
        if (ride.rows[0].creator_id === req.decode.user_id) {
          // 403 U CAN'T REQUEST UR OWN RIDE
          res.status(403).json({
            message: 'Sorry, You cannot request your own ride',
            status: false,
            error: 'Cannot Request Own Ride',
          });
        } else {
          // CHECK IF USER ALREADY PLACE A REQUEST ON THIS RIDE
          pool.query('SELECT EXISTS (SELECT 1 FROM requests WHERE ride_id = $1 AND sender_id = $2) AS "hasRequested"', [rideId, req.decode.user_id], (error3, request) => {
            if (error3) {
              res.status(500).json({
                message: 'Something went wrong, Unable to determine if ride exists',
                status: false,
                error: error3.message,
              });
            } else if (!(request.rows[0].hasRequested)) {
              // CHECK VACANCY
              if (ride.rows[0].capacity > ride.rows[0].space_occupied) {
                // GOOD : SAVE REQUEST
                const query = 'INSERT INTO requests (sender,sender_id, ride_id, status) VALUES ($1, $2, $3, $4) RETURNING *';
                const queryValues = [sender, userId, rideId, 'pending'];
                pool.query(query, queryValues, (error2, newRequest) => {
                  if (error2) {
                    res.status(500).json({
                      message: 'Something went wrong, Unable to save request',
                      status: false,
                      error: error2.message,
                    });
                  } else if (newRequest.rows[0]) {
                    res.status(200).json({
                      message: 'Your request was successfully received.',
                      status: true,
                      request: newRequest.rows[0],
                    });
                  }
                });
              } else {
                // RIDE IS OCCUPIED 403
                res.status(403).json({
                  message: 'Ride is fully occupied',
                  status: false,
                  error: 'No Vacant Space In Ride',
                });
              }
            } else {
              // REQUEST ALREADY EXIST
              res.status(403).json({
                message: 'Sorry, You have already requested this ride',
                status: false,
                error: 'Request Already Exist',
              });
            }
          });
        }
      } else {
        // RIDE NO EXIST
        res.status(404).json({
          message: 'You are requesting to join a non existing ride',
          status: false,
          error: 'Ride Not Found',
        });
      }
    });
  }
}


export default RideController;
