import express from 'express';
import { RideRequests, Rides } from '../models/data';

const route = express.Router();

route.get('/', (req, res) => {
  res.json(Rides);
});

route.get('/:rideId', (req, res) => {
  const id = req.params.rideId;
  res.json(Rides[id]);
});

route.post('/', (req, res) => {
  const newRide = req.body;
  const rideKeys = Object.keys(Rides);
  let maxKey = Math.max(...rideKeys);
  Rides[maxKey + 1] = newRide;
  res.send(`You ride to ${newRide.destination} was successfully created`);
});

route.post('/:rideId/request', (req, res) => {
  const id = req.params.rideId;
  const requestKeys = Object.keys(RideRequests);
  let maxRequestKey = Math.max(...requestKeys);
  // STATUS: [pending,accepted,rejected]
  // TODO: Check if user is a friend to the driver and add isMyFriend property to the newRequest
  const newRequest = {
    passenger: req.body.passenger,
    ride_id: id,
    status: 'pending',
  };
  RideRequests[maxRequestKey + 1] = newRequest;
  res.json('Your request has been successfully received, You will be notified if Accepted!');
});

export default route;
