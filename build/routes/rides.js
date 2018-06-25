'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rideRoutes = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _data = require('../models/data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var route = _express2.default.Router();

route.get('/', function (req, res) {
  res.json(_data.Rides);
});

route.get('/:rideId', function (req, res) {
  var id = req.params.rideId;
  // checking to see if the requested ride exist
  if (!Object.prototype.hasOwnProperty.call(_data.Rides, id)) {
    res.status(404).json({ message: 'This ride offer does not exist or may have been deleted', status: 'failure', data: {}, error: 'Ride Not Found!' });
  }
  res.json(_data.Rides[id]);
});

route.post('/', function (req, res) {
  var fieldErrors = {};
  var newRide = req.body;
  var destination = newRide.destination,
      date = newRide.date,
      time = newRide.time;


  var willSave = true;

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
    var creator = {
      username: 'req.user.username',
      displayName: 'req.user.displayName'
    };
    // using default driver display name
    newRide.creator = creator;
    newRide.requests = [];

    var rideKeys = Object.keys(_data.Rides);
    var maxKey = Math.max.apply(Math, _toConsumableArray(rideKeys));

    _data.Rides[maxKey + 1] = newRide;
    res.json({ message: 'You ride to ' + newRide.destination + ' was successfully created', status: 'success', data: newRide });
  } else {
    res.status(404).json({ message: 'Required field(s) is/are missing', status: 'failure', data: newRide, errors: fieldErrors });
  }
});

route.post('/:ride_id/request', function (req, res) {
  var rideId = req.params.ride_id;
  if (Object.prototype.hasOwnProperty.call(_data.Rides, rideId)) {
    var id = Number(rideId);
    // STATUS: [pending,accepted,rejected]
    // TODO: Check if user is a friend to the driver and add isMyFriend property to the newRequest
    // username: req.user.username
    // displayName: req.user.displayName
    var newRequest = {
      passenger: {
        username: 'femoo',
        displayName: 'Femi'
      },
      status: 'pending',
      requestDate: Date.now()
    };
    // ride offer creator
    var creator = _data.Rides[rideId].creator.username;
    // check if the person send this request is a friend to the ride creator
    if (_data.Users[creator].friends.includes(newRequest.passenger.username)) {
      newRequest.isMyFriend = true;
    } else {
      newRequest.isMyFriend = false;
    }

    // giving the request a unique id
    var availableRequestKeys = [];
    _data.Rides[rideId].requests.forEach(function (request) {
      availableRequestKeys.push(request.id);
    });
    var maxRequestKey = Math.max.apply(Math, availableRequestKeys);
    newRequest.id = maxRequestKey + 1;
    // save the new ride request
    _data.Rides[rideId].requests.push(newRequest);
    res.json({ message: 'Your request has been successfully received, You will be notified if Accepted!', status: 'success', data: newRequest });
  } else {
    res.status(404).json({ message: 'The ride you are requesting does not exist or may have been deleted', status: 'failure', data: {}, error: 'Ride Not Found!' });
  }
});

exports.rideRoutes = route;