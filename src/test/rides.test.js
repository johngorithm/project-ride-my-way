/* globals describe, it  */

import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { token, token2, token3 } from '../helpers/generateToken';

chai.use(chaiHttp);
should();


describe('TESTS FOR RIDE MY WAY API RIDES` ENDPOINTS', () => {
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
        response.text.should.contain('<!DOCTYPE html>');
        response.type.should.equal('text/html');
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
          expect(response.body.ride).have.property('destination');
          expect(typeof response.body.ride.destination).be.a('string');
          expect(response.body.ride.status).to.equal('empty');
          done();
        });
    });


    it('should return with a status code of 404 when the requested ride does not exist in the data store and did not violate database constraints', (done) => {
      chai.request(app)
        .get('/api/v1/rides/2789070')
        .set('x-access-token', token)
        .end((error, response) => {
          expect(response).to.have.status(404);
          response.body.should.have.property('error');
          response.body.error.should.equal('Ride Not Found!');
          response.body.status.should.equal(false);
          done();
        });
    });

    it('should fail when ride ID is INVALID', (done) => {
      chai.request(app)
        .get('/api/v1/rides/2id')
        .set('x-access-token', token)
        .end((error, response) => {
          expect(response).to.have.status(400);
          done();
        });
    });
  });


  describe('POST A RIDE REQUEST ENDPOINT TESTS', () => {
    it('should return successfully when `id` of the ride being requested is found in the database and `request to join operation` is successful', (done) => {
      chai.request(app)
        .post('/api/v1/rides/5/requests')
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

    it('should fail when requesting a specific ride more than once', (done) => {
      chai.request(app)
        .post('/api/v1/rides/5/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal(false);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should fail when requesting to join own ride', (done) => {
      chai.request(app)
        .post('/api/v1/rides/3/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.status.should.equal(403);
          response.body.status.should.equal(false);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should fail when the ride beign requested does not exists', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.status.should.equal(404);
          response.body.status.should.equal(false);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should fail when ride ID being requested is INVALID', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56invalid/requests')
        .set('x-access-token', token)
        .end((error, response) => {
          response.status.should.equal(400);
          response.body.status.should.equal(false);
          response.body.should.have.property('error');
          done();
        });
    });

    it('should accept request successfully', (done) => {
      chai.request(app)
        .put('/api/v1/users/rides/5/requests/10')
        .set('x-access-token', token3)
        .query({ action: 'accept' })
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.status.should.equal(true);
          expect(error).to.equal(null);
          done();
        });
    });

    it('should fail when RIDE capacity is fully occupied', (done) => {
      chai.request(app)
        .post('/api/v1/rides/5/requests')
        .set('x-access-token', token2)
        .end((error, response) => {
          expect(response).to.have.status(403);
          response.body.status.should.equal(false);
          response.body.error.should.equal('No Vacant Space In Ride');
          done();
        });
    });
  });
});
