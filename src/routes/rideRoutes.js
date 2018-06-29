import express from 'express';
import { Rides, Users } from '../models/data';
import pool from '../config/databaseConfig';

const rideRoutes = express.Router();

rideRoutes.get('/', (req, res) => {
  res.json(Rides);
});

rideRoutes.get('/:rideId', (req, res) => {
  const id = req.params.rideId;
  if (!Object.prototype.hasOwnProperty.call(Rides, id)) {
    res.status(404).json({
      message: 'This ride offer does not exist or may have been deleted',
      status: 'failure',
      data: {},
      error: 'Ride Not Found!',
    });
  }
  res.json(Rides[id]);
});

rideRoutes.post('/', (req, res) => {
  const fieldErrors = {};
  const newRide = req.body;
  const {
    destination,
    date,
    time,
  } = newRide;

  let willSave = true;

  if (typeof destination === 'string') {
    if (destination.trim() === '') {
      fieldErrors.destination = 'destination is required';
      willSave = false;
    }
  } else if (destination === undefined) {
    fieldErrors.destination = 'destination is required';
    willSave = false;
  }

  if (typeof date === 'string') {
    if (date.trim() === '') {
      fieldErrors.date = 'date is required';
      willSave = false;
    }
  } else if (date === undefined) {
    fieldErrors.date = 'date is required';
    willSave = false;
  }

  if (typeof time === 'string') {
    if (time.trim() === '') {
      fieldErrors.time = 'time is required';
      willSave = false;
    }
  } else if (time === undefined) {
    fieldErrors.time = 'time is required';
    willSave = false;
  }


  if (willSave === true) {
    const creator = {
      username: 'req.user.username',
      displayName: 'req.user.displayName',
    };

    newRide.creator = creator;
    newRide.requests = [];

    const rideKeys = Object.keys(Rides);
    const maxKey = Math.max(...rideKeys);


    Rides[maxKey + 1] = newRide;
    res.json({ message: `You ride to ${newRide.destination} was successfully created`, status: 'success', data: newRide });
  } else {
    res.status(404).json({
      message: 'Required field(s) is/are missing', status: 'failure', data: newRide, errors: fieldErrors,
    });
  }
});

rideRoutes.post('/:ride_id/request', (req, res) => {
  const rideId = req.params.ride_id;
  if (Object.prototype.hasOwnProperty.call(Rides, rideId)) {
    const newRequest = {
      passenger: {
        username: 'femoo',
        displayName: 'Femi',
      },
      status: 'pending',
      requestDate: Date.now(),
    };

    const creator = Rides[rideId].creator.username;
    if (Users[creator].friends.includes(newRequest.passenger.username)) {
      newRequest.isMyFriend = true;
    } else {
      newRequest.isMyFriend = false;
    }

    const availableRequestKeys = [];
    Rides[rideId].requests.forEach((request) => {
      availableRequestKeys.push(request.id);
    });
    const maxRequestKey = Math.max(...availableRequestKeys);
    newRequest.id = maxRequestKey + 1;
    Rides[rideId].requests.push(newRequest);
    res.json({ message: 'Your request has been successfully received, You will be notified if Accepted!', status: 'success', data: newRequest });
  } else {
    res.status(404).json({
      message: 'The ride you are requesting does not exist or may have been deleted', status: 'failure', data: {}, error: 'Ride Not Found!',
    });
  }
});

export default rideRoutes;
