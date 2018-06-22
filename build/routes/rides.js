'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  res.json(_data.Rides[id]);
});

route.post('/', function (req, res) {
  var newRide = req.body;
  var rideKeys = Object.keys(_data.Rides);
  var maxKey = Math.max.apply(Math, _toConsumableArray(rideKeys));
  _data.Rides[maxKey + 1] = newRide;
  res.json({ message: 'You ride to ' + newRide.destination + ' was successfully created', status: 'success', data: newRide });
});

route.post('/:rideId/request', function (req, res) {
  var id = Number(req.params.rideId);
  var requestKeys = Object.keys(_data.RideRequests);
  var maxRequestKey = Math.max.apply(Math, _toConsumableArray(requestKeys));
  // STATUS: [pending,accepted,rejected]
  // TODO: Check if user is a friend to the driver and add isMyFriend property to the newRequest
  var newRequest = {
    passenger: req.body.passenger,
    ride_id: id,
    status: 'pending'
  };
  _data.RideRequests[maxRequestKey + 1] = newRequest;
  res.json({ message: 'Your request has been successfully received, You will be notified if Accepted!', status: 'success', data: newRequest });
});

exports.default = route;