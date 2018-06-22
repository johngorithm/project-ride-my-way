'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiHttp2.default);
var should = _chai2.default.should();

describe('Test for Ride My Way Api endpoints', function () {
  describe('Test: 404 Not Found', function () {
    it('should return a status Code of 404 for unknown route', function () {
      _chai2.default.request(_app2.default).get('/unknown').end(function (error, response) {
        response.should.have.status(404);
      });
    });
  });

  describe('/rides TESTS', function () {
    it('/rides should return with a content-Type of json', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides').end(function (error, response) {
        response.type.should.equal('application/json');
        done();
      });
    });

    it('/rides should return a status code of 200', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides').end(function (error, response) {
        response.should.have.status(200);
        done();
      });
    });

    it('/rides should return an object', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides').end(function (error, response) {
        response.body.should.to.be.an('object');
        done();
      });
    });

    it('/rides should return an objects with `destination` properties', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides').end(function (error, response) {
        response.body[1].should.have.property('destination');
        response.body[2].should.have.property('destination');
        response.body[3].should.have.property('destination');
        done();
      });
    });
  });

  describe('GET /rides/<id> endpoint TESTS', function () {
    it('/rides/<id> should return with a content-Type of json', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides/1').end(function (error, response) {
        response.type.should.equal('application/json');
        done();
      });
    });

    it('/rides/<id> should return a status code of 200', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides/4').end(function (error, response) {
        response.should.have.status(200);
        done();
      });
    });

    it('/rides/<id> should return an object', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides/2').end(function (error, response) {
        response.body.should.to.be.an('object');
        done();
      });
    });

    it('/rides/<id> should return only 1 object with 4 properties', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides/1').end(function (error, response) {
        Object.keys(response.body).length.should.equal(4);
        done();
      });
    });

    it('/rides/<id> should return an object with a `destination` property', function (done) {
      _chai2.default.request(_app2.default).get('/api/v1/rides/2').end(function (error, response) {
        response.body.should.have.property('destination');
        done();
      });
    });
  });

  describe('POST /rides endpoint TESTS', function () {
    var ride = {
      destination: 'Oja',
      time: '5:00 PM',
      data: '30/6/2018',
      driver: 'New Man'
    };

    it('POST to /rides should return with a status code of 200', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides').send(ride).end(function (error, response) {
        response.should.have.status(200);
        done();
      });
    });

    it('POST to /rides should return an object', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides').send(ride).end(function (error, response) {
        response.body.should.be.an('object');
        done();
      });
    });

    it('POST to /rides should return with a message property', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides').send(ride).end(function (error, response) {
        response.body.should.have.property('message');
        done();
      });
    });

    it('POST to /rides should return with a `success` as status', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides').send(ride).end(function (error, response) {
        response.body.should.have.property('status');
        response.body.status.should.equal('success');
        done();
      });
    });

    it('POST to /rides returns the saved Ride object', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides').send(ride).end(function (error, response) {
        response.body.should.have.property('data');
        response.body.data.should.have.property('destination');
        response.body.data.should.be.an('object');
        done();
      });
    });
  });

  describe('POST /rides/<id>/request endpoint TESTS', function () {
    var request = {
      passenger: 'Annabel'
    };
    it('Post to /rides/<id>/request should return with a status code of 200', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        response.status.should.equal(200);
        done();
      });
    });

    it('Post to /rides/<id>/request should return an object', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        response.body.should.be.an('object');
        response.type.should.equal('application/json');
        done();
      });
    });

    it('Post to /rides/<id>/request should not return an error', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        should.not.exist(error);
        done();
      });
    });

    it('Post to /rides/<id>/request should return with a data object', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        response.body.should.have.property('data');
        response.body.data.should.be.an('object');
        response.body.data.should.have.property('passenger');
        done();
      });
    });

    it('Post to /rides/<id>/request should have a value for it\'s ride id', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        response.body.data.should.have.property('ride_id');
        response.body.data.ride_id.should.be.greaterThan(0);
        done();
      });
    });

    it('Post to /rides/2/request should return 2 as it\'s ride\'s id for the request', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/2/request').send(request).end(function (error, response) {
        response.body.data.ride_id.should.equal(2);
        done();
      });
    });

    it('Post to /rides/<id>/request serve `status` should be `success`', function (done) {
      _chai2.default.request(_app2.default).post('/api/v1/rides/1/request').send(request).end(function (error, response) {
        response.body.should.have.property('status');
        response.body.status.should.equal('success');
        done();
      });
    });
  });
});