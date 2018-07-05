/* globals describe, it, before  */

import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJ1c2VybmFtZSI6ImhlbnJ5IiwiZmlyc3RuYW1lIjoiQ2hpdG8iLCJpYXQiOjE1MzA3MTM2MTUsImV4cCI6MTUzMDgwMDAxNX0.TQOCTpm8pt4E5HYFCdQCcaeS1lomu0KUfZ9aMtKSY-A';
chai.use(chaiHttp);
should();

describe('TESTS FOR RIDE MY WAY API ENDPOINTS', () => {
  describe('Test: 404 Not Found', () => {
    it('should return a status Code of 404 for unknown route', (done) => {
      chai.request(app).get('/unknown').end((error, response) => {
        expect(response).to.have.status(404);
        done();
      });
    });
  });

  describe('INDEX ENDPOINT TESTS', () => {
    it('should response successfully under good network conditions', (done) => {
      chai.request(app).get('/').end((error, response) => {
        expect(response).to.have.status(200);
        done();
      });
    });
  });

  describe('GET ALL RIDES ENDPOINT TESTS', () => {
    it('should return all rides successfully', (done) => {
      chai.request(app).get('/api/v1/rides').set('x-access-token', token).end((error, response) => {
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('rides');
        expect(response.body.rides).to.be.an('array');
        done();
      });
    });
  });

  describe('GET INDIVIDUAL RIDE TESTS', () => {
    it('should return a specific ride successfully when the requested ride is found', (done) => {
      chai.request(app)
        .get('/api/v1/rides/1').set('x-access-token', token)
        .end((error, response) => {
          expect(response.type).equal('application/json');
          expect(response).have.status(200);
          expect(response.body).to.be.an('object');
          expect(Object.keys(response.body.ride).length).to.equal(8);
          expect(response.body.ride).have.property('destination');
          expect(typeof response.body.ride.destination).be.a('string');
          done();
        });
    });


    it('should return with a status code of 404 when the requested ride does not exist in the data store and did not violate database constraints', (done) => {
      chai.request(app)
        .get('/api/v1/rides/2789070')
        .set('x-access-token', token)
        .end((error, response) => {
          expect(response).to.have.status(404);
          done();
        });
    });
  });


  describe('POST A RIDE OFFER ENDPOINT TESTS', () => {
    it('should return successfully when posted data has values for all the required fields', (done) => {
      chai.request(app)
        .post('/api/v1/users/rides')
        .send({
          destination: 'Oja',
          time: '5:00 PM',
          date: '12/6/2018',
          driver: 'New Man',
          takeOffVenue: 'Epic Tower',
        })
        .set('x-access-token', token)
        .end((error, response) => {
          expect(response).to.have.status(200);
          done();
        });
    });


    it('should return unsuccessfully, when a post request is made with missing required fields', (done) => {
      chai.request(app)
        .post('/api/v1/users/rides')
        .set('x-access-token', token)
        .send({})
        .end((error, response) => {
          response.body.errors.should.be.an('object');
          response.body.errors.should.have.property('destination');
          response.body.errors.destination.should.equal('destination is required');
          response.body.should.have.property('status');
          response.body.status.should.equal(false);
          response.body.should.have.property('message');
          response.body.message.should.have.equal('Required field(s) is/are missing');
          response.status.should.equal(400);
          done();
        });
    });

    it('should return with a status code of 400 : Bad Request when a post request is made with no data', (done) => {
      chai.request(app)
        .post('/api/v1/users/rides')
        .set('x-access-token', token)
        .send()
        .end((error, response) => {
          response.status.should.equal(400);
          done();
        });
    });


    it('should return with a status code of 400 : Bad Request when required post properties exist but having empty strings as value', (done) => {
      chai.request(app)
        .post('/api/v1/users/rides')
        .set('x-access-token', token)
        .send({
          destination: '',
          time: '',
          date: '',
        })
        .end((error, response) => {
          response.status.should.equal(400);
          done();
        });
    });
  });


  describe('POST A RIDE REQUEST ENDPOINT TESTS', () => {
    it('should return successfully when `id` of the ride being requested is found in the database and `request to join operation` is successful', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.should.be.an('object');
          response.type.should.equal('application/json');
          response.body.should.have.property('request');
          response.body.request.should.be.an('object');
          response.body.request.should.have.property('sender');
          response.body.request.should.have.property('status');
          response.body.request.status.should.have.equal('pending');
          response.body.status.should.equal(true);
          done();
        });
    });

    it('should return an object with `status` property equal to `failure` when the ride offer in question does not exist or is deleted or the `request to operation` is not successful', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.body.status.should.equal(false);
          response.body.should.have.property('error');
          done();
        });
    });
  });
});
