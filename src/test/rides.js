
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;


describe('Test for Ride My Way Api endpoints', function () {
  describe('/rides TESTS', function () {
    it('/rides should return a status code of 200', function (done) {
      chai.request(app).get('/api/v1/rides').end(function (error, response) {
        response.should.have.status(200);
        done();
      });
    });

    it('/rides should return an object', function (done) {
      chai.request(app).get('/api/v1/rides').end(function (error, response) {
        response.body.should.to.be.an('object');
        done();
      });
    });

    it('/rides should return an object with a `name` property', function (done) {
      chai.request(app).get('/api/v1/rides').end(function (error, response) {
        response.body[1].should.have.property('destination');
        done();
      });
    });
  });
});

