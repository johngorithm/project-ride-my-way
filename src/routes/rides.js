import express from 'express';
import { Rides, Users } from '../models/data';

const route = express.Router();

route.get('/', (req, res) => {
  res.json(Rides);
});

route.get('/:rideId', (req, res) => {
  const id = req.params.rideId;
  // checking to see if the requested ride exist
  if (!Object.prototype.hasOwnProperty.call(Rides, id)) {
    res.status(404).send('Not Found');
  }
  res.json(Rides[id]);
});

route.post('/', (req, res) => {
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


  // driver name is got from params.user.displayName

  if (willSave === true) {
    // restructuring the new ride
    let creator = {
      username: 'req.user.username',
      displayName: 'req.user.displayName',
    };
    // using default driver display name
    newRide.creator = creator;
    newRide.requests = [];

    const rideKeys = Object.keys(Rides);
    let maxKey = Math.max(...rideKeys);


    Rides[maxKey + 1] = newRide;
    res.json({ message: `You ride to ${newRide.destination} was successfully created`, status: 'success', data: newRide });
  } else {
    res.status(404).json({ message: 'Required field(s) is/are missing', status: 'failure', data: newRide, errors: fieldErrors });
  }
});

route.post('/:ride_id/request', (req, res) => {
  let rideId = req.params.ride_id;
  if (Object.prototype.hasOwnProperty.call(Rides, rideId)) {
    const id = Number(rideId);
    // STATUS: [pending,accepted,rejected]
    // TODO: Check if user is a friend to the driver and add isMyFriend property to the newRequest
    // username: req.user.username
    // displayName: req.user.displayName
    const newRequest = {
      passenger: {
        username: 'femoo',
        displayName: 'Femi',
      },
      status: 'pending',
      requestDate: Date.now(),
    };
    // ride offer creator
    const creator = Rides[rideId].creator.username;
    // check if the person send this request is a friend to the ride creator
    if (Users[creator].friends.includes(newRequest.passenger.username)) {
      newRequest.isMyFriend = true;
    } else {
      newRequest.isMyFriend = false;
    }

    // giving the request a unique id
    const availableRequestKeys = [];
    Rides[rideId].requests.forEach((request) => {
      availableRequestKeys.push(request.id);
    });
    const maxRequestKey = Math.max(...availableRequestKeys);
    newRequest.id = maxRequestKey + 1;
    // save the new ride request
    Rides[rideId].requests.push(newRequest);
    res.json({ message: 'Your request has been successfully received, You will be notified if Accepted!', status: 'success', data: newRequest });
  } else {
    res.status(404).json({ message: 'The ride you are requesting does not exist or may have been deleted', status: 'failure', data: {}, error: 'Ride Not Found!' });
  }
});

export { route as rideRoutes };
