
import pool from '../config/databaseConfig';


class UserController {
  static createRideOffer(req, res) {
    const {
      destination, time, date, takeOffVenue, capacity,
    } = req.body;
    // ID of authenticated user posting this ride
    const creatorId = req.decode.user_id;
    const creator = req.decode.firstname;
    pool.query('INSERT INTO rides (destination, time, date, take_off_venue, creator_id, creator, capacity, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [destination, time, date, takeOffVenue, creatorId, creator, capacity, 'empty'], (rideError, createdRide) => {
      if (rideError) {
        res.status(500).json({
          message: 'Something went wrong, Unable to save ride',
          status: false,
          data: req.body,
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
        if (error.code === '22P02') {
          res.status(400).json({
            message: 'The ID of the ride in this request is invalid',
            status: false,
            error: error.message,
          });
        } else {
          res.status(500).json({
            message: 'Something went wrong, Unable to fetch ride',
            status: false,
            error: error.message,
          });
        }
      } else if (requests.rows[0]) {
        res.status(200).json({
          message: 'Requests retrieved successfully',
          status: true,
          requests: requests.rows,
        });
      } else {
        res.status(404).json({
          message: 'No request found for this ride',
          status: false,
          error: 'No Request Found!',
        });
      }
    });
  }

  static acceptOrRejectRideRequest(req, res) {
    const { rideId, requestId } = req.params;
    const { action } = req.query;

    if (typeof action !== 'string') {
      res.status(400).json({
        message: 'Your action query is invalid or not specified',
        status: false,
        error: 'Invalid Action Query Parameter',
      });
      return;
    }

    if (action.toLowerCase() === 'accept' || action.toLowerCase() === 'reject') {
      // CHECKING IF RIDE OWNER IS THE ONE TRYING TO UPDATE ITS REQUEST
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
            pool.query('SELECT status FROM requests WHERE request_id = $1 AND ride_id = $2', [requestId, rideId], (error1, requestToUpdate) => {
              if (error1) {
                if (error1.code === '22P02') {
                  res.status(400).json({
                    message: 'Your request contains invalid request ID',
                    status: false,
                    error: 'Invalid Request ID',
                  });
                } else {
                  res.status(500).json({
                    message: 'Something went wrong, Request was not fetched',
                    status: false,
                    error: error1.message,
                  });
                }
              } else if (requestToUpdate.rows[0]) {
                // check if request has been updated
                if (requestToUpdate.rows[0].status === 'pending') {
                  if (action.toLowerCase() === 'accept') {
                    // CHECK IF RIDE IS STILL VACANT
                    if (ride.rows[0].capacity > ride.rows[0].space_occupied) {
                      // UPDATE RIDE REQUEST
                      pool.query('UPDATE requests SET status = $1 WHERE request_id = $2 AND ride_id = $3 RETURNING *', ['accepted', requestId, rideId], (error2, updatedRequest) => {
                        if (error2) {
                          res.status(500).json({
                            message: 'Something went wrong, Unable to update request',
                            status: false,
                            error: error2.message,
                          });
                        } else {
                          pool.query('UPDATE rides SET space_occupied = space_occupied + 1 WHERE ride_id = $1 RETURNING *', [updatedRequest.rows[0].ride_id], (error3) => {
                            if (error3) {
                              // WRITE ERROR LOG TO A FILE
                              throw new Error(error3.message);
                            } else {
                              // SEND NOTIFICATION
                              const message = `Your request to join a ride to ${ride.rows[0].destination} has been Accepted. Please keep to time`;

                              pool.query('INSERT INTO notifications (message, sender, sender_id, receiver_id) VALUES ($1, $2, $3, $4)', [message, req.decode.firstname, req.decode.user_id, updatedRequest.rows[0].sender_id], (error5) => {
                                if (error5) {
                                  // WRITE ERROR LOG TO A FILE
                                  throw new Error(error5.message);
                                } else {
                                  res.status(200).json({
                                    message: 'Request was successfully accepted',
                                    status: true,
                                    request: updatedRequest.rows[0],
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    } else {
                      // RIDE IS OCCUPIED 403
                      res.status(403).json({
                        message: 'This Ride is fully occupied',
                        status: false,
                        error: 'No Vacant Space In Ride',
                      });
                    }
                  } else {
                    // REJECT
                    // UPDATE RIDE REQUEST
                    pool.query('UPDATE requests SET status = $1 WHERE request_id = $2 AND ride_id = $3 RETURNING *', ['rejected', requestId, rideId], (error4, updatedRequest) => {
                      if (error4) {
                        res.status(500).json({
                          message: 'Something went wrong, Unable to update request',
                          status: false,
                          error: error4.message,
                        });
                      } else {
                        // SEND NOTIFICATION
                        const message = `Sorry, Your request to join a ride to ${ride.rows[0].destination} was Rejected.`;

                        pool.query('INSERT INTO notifications (message, sender, sender_id, receiver_id) VALUES ($1, $2, $3, $4)', [message, req.decode.firstname, req.decode.user_id, updatedRequest.rows[0].sender_id], (error6) => {
                          if (error6) {
                            // WRITE ERROR LOG TO A FILE
                            throw new Error(error6.message);
                          } else {
                            res.status(200).json({
                              message: 'Request was successfully rejected',
                              status: true,
                              request: updatedRequest.rows[0],
                            });
                          }
                        });
                      }
                    });
                  }
                } else {
                  res.status(403).json({
                    message: `Sorry, you have already ${requestToUpdate.rows[0].status} this Request`,
                    status: false,
                    error: `Cannot ${action} A Request After Action Has Been Taken`,
                  });
                }
              } else {
                res.status(404).json({
                  message: 'This request is not found',
                  status: false,
                  error: 'Request Not Found',
                });
              }
            });
          } else {
            res.status(403).json({
              message: 'Sorry, This Ride offer was not created by you, therefore you cannot alter its request',
              status: false,
              error: 'Cannot Update Request Of Ride Offers Not Belonging To You',
            });
          }
        } else {
          res.status(404).json({
            message: 'The ride offer you are trying to update its request does not exist',
            status: false,
            error: 'Ride Not Found',
          });
        }
      });
    } else {
      res.status(400).json({
        message: 'Your action query is invalid or not specified',
        status: false,
        error: 'Invalid Action Query Parameter',
      });
    }
  }

  static getUserData(req, res) {
    const query = 'SELECT user_id, firstname, lastname, username, email, image_url FROM users WHERE user_id = $1';
    pool.query(query, [req.decode.user_id], (error, user) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to get user data',
          status: false,
          error: error.message,
        });
      } else if (user.rows[0]) {
        res.status(200).json({
          message: `Welcome ${user.rows[0].firstname}`,
          status: true,
          user: user.rows[0],
        });
      } else {
        res.status(404).json({
          message: 'This user does not exist',
          status: false,
          error: 'User Not Found',
        });
      }
    });
  }

  static getRidesOfferedByUser(req, res) {
    const query = 'SELECT * FROM rides WHERE creator_id = $1 ORDER BY ride_id DESC';
    pool.query(query, [req.decode.user_id], (error, ridesOffered) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to fetch offered rides',
          status: false,
          error: error.message,
        });
      } else if (ridesOffered.rows[0]) {
        res.status(200).json({
          message: `Rides offered by ${req.decode.firstname} retrieved successfully`,
          status: true,
          rides: ridesOffered.rows,
          total: ridesOffered.rowCount,
        });
      } else {
        res.status(404).json({
          message: 'You have not offered any ride yet',
          status: false,
          error: 'No Ride Found',
        });
      }
    });
  }

  static getRidesTakenByUser(req, res) {
    const query = `SELECT 
    rides.ride_id, 
    destination, 
    time, 
    date, 
    take_off_venue, 
    creator, 
    creator_id, 
    capacity, 
    space_occupied 
    FROM rides 
    INNER JOIN requests 
    ON rides.ride_id = requests.ride_id 
    AND requests.status = $1 
    AND requests.sender_id = $2 ORDER BY ride_id DESC`;
    pool.query(query, ['accepted', req.decode.user_id], (error, userRides) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to fetch rides that you have taken',
          status: false,
          error: error.message,
        });
      } else if (userRides.rows[0]) {
        res.status(200).json({
          message: `Rides taken by ${req.decode.firstname} retrieved successfully`,
          status: true,
          rides: userRides.rows,
          total: userRides.rowCount,
        });
      } else {
        res.status(404).json({
          message: 'You have not taken any ride yet',
          status: false,
          error: 'No Ride Found',
        });
      }
    });
  }

  static getRequestsForUser(req, res) {
    const query = `SELECT 
    request_id, 
    sender, 
    sender_id, 
    requests.ride_id, 
    rides.destination, 
    rides.creator_id,
    requests.status
    FROM requests 
    INNER JOIN rides 
    ON requests.ride_id = rides.ride_id 
    AND creator_id = $1 
    ORDER BY request_id DESC`;

    pool.query(query, [req.decode.user_id], (error, userRequests) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to fetch your ride requests',
          status: false,
          error: error.message,
        });
      } else if (userRequests.rows[0]) {
        res.status(200).json({
          message: `${req.decode.firstname}'s ride requests retrieved successfully`,
          status: true,
          requests: userRequests.rows,
          total: userRequests.rowCount,
        });
      } else {
        res.status(404).json({
          message: 'You have not received any request yet',
          status: false,
          error: 'No Request Found',
        });
      }
    });
  }

  static getUserNotifications(req, res) {
    const query = `SELECT 
      message,
      received_on,
      image_url,
      username,
      firstname,
      lastname,
      email
      FROM notifications
      INNER JOIN users
      ON sender_id = user_id
      WHERE receiver_id = $1
      ORDER BY notification_id DESC
    `;
    pool.query(query, [req.decode.user_id], (error, notifications) => {
      if (error) {
        res.status(500).json({
          message: 'Something went wrong, Unable to fetch your ride requests',
          status: false,
          error: error.message,
        });
      } else if (notifications.rows[0]) {
        res.status(200).json({
          message: `${req.decode.firstname}'s notifications retrieved successfully`,
          status: true,
          notifications: notifications.rows,
        });
      } else {
        res.status(404).json({
          message: 'You have not received any notification yet',
          status: false,
          error: 'No Notification Found',
        });
      }
    });
  }
}


export default UserController;
