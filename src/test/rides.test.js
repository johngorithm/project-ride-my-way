/* globals describe, it  */

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
chai.should();


describe('TESTS FOR RIDE MY WAY API ENDPOINTS', () => {
  describe('Test: 404 Not Found', () => {
    it('should return a status Code of 404 for unknown route', () => {
      chai.request(app).get('/unknown').end((error, response) => {
        response.should.have.status(404);
      });
    });
  });

  describe('INDEX ENDPOINT TESTS', () => {
    it('should response successfully under good network conditions', (done) => {
      chai.request(app).get('/').end((error, response) => {
        response.should.have.status(200);
        response.type.should.equal('text/html');
        done();
      });
    });
  });

  describe('GET ALL RIDES ENDPOINT TESTS', () => {
    it('should return all rides successfully', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        response.type.should.equal('application/json');
        response.should.have.status(200);
        response.body.should.to.be.an('object');
        response.body[1].should.have.property('destination');
        response.body[2].should.have.property('destination');
        response.body[3].should.have.property('destination');
        (typeof response.body[1].destination).should.be.a('string');
        done();
      });
    });
  });

  describe('GET INDIVIDUAL RIDE TESTS', () => {
    it('should return a specific ride successfully when the requested ride is found', (done) => {
      chai.request(app).get('/api/v1/rides/1').end((error, response) => {
        response.type.should.equal('application/json');
        response.should.have.status(200);
        response.body.should.to.be.an('object');
        Object.keys(response.body).length.should.equal(5);
        response.body.should.have.property('destination');
        (typeof response.body.destination).should.be.a('string');
        done();
      });
    });


    it('should return with a status code of 404 when the requested ride does not exist in the data store', (done) => {
      chai.request(app)
        .get('/api/v1/rides/65645')
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });
  });


  describe('POST A RIDE OFFER ENDPOINT TESTS', () => {
    it('should return successfully when posted data has values for all the required fields', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send({
          destination: 'Oja',
          time: '5:00 PM',
          date: '30/6/2018',
          driver: 'New Man',
        })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('message');
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          response.body.should.have.property('data');
          response.body.data.should.be.an('object');
          response.body.data.should.have.property('destination');
          response.body.data.destination.should.equal('Oja');
          done();
        });
    });


    it('should return unsuccessfully, when a post request is made with missing required fields', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send({})
        .end((error, response) => {
          response.body.errors.should.be.an('object');
          response.body.errors.should.have.property('destination');
          response.body.errors.destination.should.equal('destination is required');
          response.body.should.have.property('status');
          response.body.status.should.equal('failure');
          response.body.should.have.property('message');
          response.body.message.should.have.equal('Required field(s) is/are missing');
          response.status.should.equal(404);
          done();
        });
    });

    it('should return with a status code of 404:Bad Request when a post request is made with no data', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send()
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });


    it('should return with a status code of 404:Bad Request when required post properties exist but having empty strings as value', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send({
          destination: '',
          time: '',
          date: '',
        })
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });
  });


  describe('POST A RIDE REQUEST ENDPOINT TESTS', () => {
    it('should return successfully when `id` of the ride being requested is found in the database and `request to join operation` is successful', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .end((error, response) => {
          response.status.should.equal(200);
          response.body.should.be.an('object');
          response.type.should.equal('application/json');
          response.body.should.have.property('data');
          response.body.data.should.be.an('object');
          response.body.data.should.have.property('passenger');
          response.body.data.passenger.username.length.should.be.greaterThan(0);
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        });
    });

    it('should return an object with `status` property equal to `failure` when the ride offer in question does not exist or is deleted or the `request to operation` is not successful', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56/request')
        .end((error, response) => {
          response.body.status.should.equal('failure');
          response.body.should.have.property('error');
          response.body.error.should.equal('Ride Not Found!');
          done();
        });
    });
  });
});
