'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _rides = require('./routes/rides');

var _rides2 = _interopRequireDefault(_rides);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// middlewares
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

// routes
app.use('/api/v1/rides', _rides2.default);

var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('Server started at port: ' + port);
});

exports.default = app;