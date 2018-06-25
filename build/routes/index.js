'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexRoute = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var route = _express2.default.Router();

route.get('/', function (req, res) {
  res.sendFile('index.html');
});

exports.indexRoute = route;