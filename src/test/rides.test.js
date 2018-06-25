
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
const should = chai.should();


describe('Test for Ride My Way Api endpoints', () => {
  describe('Test: 404 Not Found', () => {
    it('should return a status Code of 404 for unknown route', () => {
      chai.request(app).get('/unknown').end((error, response) => {
        response.should.have.status(404);
      });
    });
  });

  describe('Index end-point TESTS', () => {
    it('`/` should return a status code of 200', (done) => {
      chai.request(app).get('/').end((error, response) => {
        response.should.have.status(200);
        done();
      });
    });

    it('`/` should not return an error', (done) => {
      chai.request(app).get('/').end((error, response) => {
        should.not.exist(error);
        done();
      });
    });

    it('`/` should return a content of type HTML', (done) => {
      chai.request(app).get('/').end((error, response) => {
        response.type.should.equal('text/html');
        done();
      });
    });
  });

  describe('/rides TESTS', () => {
    it('/rides should return with a content-Type of json', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        response.type.should.equal('application/json');
        done();
      });
    });

    it('/rides should return a status code of 200', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        response.should.have.status(200);
        done();
      });
    });

    it('/rides should return an object', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        response.body.should.to.be.an('object');
        done();
      });
    });

    it('/rides should return an objects with `destination` properties', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        response.body[1].should.have.property('destination');
        response.body[2].should.have.property('destination');
        response.body[3].should.have.property('destination');
        done();
      });
    });
  });

  describe('GET /rides/<id> endpoint TESTS', () => {
    it('/rides/<id> should return with a content-Type of json', (done) => {
      chai.request(app).get('/api/v1/rides/1').end((error, response) => {
        response.type.should.equal('application/json');
        done();
      });
    });

    it('/rides/<id> should return a status code of 200', (done) => {
      chai.request(app).get('/api/v1/rides/4').end((error, response) => {
        response.should.have.status(200);
        done();
      });
    });

    it('/rides/<id> should return an object', (done) => {
      chai.request(app).get('/api/v1/rides/2').end((error, response) => {
        response.body.should.to.be.an('object');
        done();
      });
    });

    it('/rides/<id> should return only 1 object with 5 properties', (done) => {
      chai.request(app).get('/api/v1/rides/1').end((error, response) => {
        Object.keys(response.body).length.should.equal(5);
        done();
      });
    });

    it('/rides/<id> should return an object with a `destination` property', (done) => {
      chai.request(app)
        .get('/api/v1/rides/2')
        .end((error, response) => {
          response.body.should.have.property('destination');
          done();
        });
    });

    it('/rides/<id> should return with a status of 404 when ride does not exist in the data store', (done) => {
      chai.request(app)
        .get('/api/v1/rides/65645')
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });
  });

  describe('POST /rides endpoint TESTS', () => {
    // good Data
    const ride = {
      destination: 'Oja',
      time: '5:00 PM',
      date: '30/6/2018',
      driver: 'New Man',
    };

    // bad Data
    const badData = {};

    it('POST to /rides should return with a status code of 200', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((error, response) => {
          response.should.have.status(200);
          done();
        });
    });

    it('POST to /rides should return an object', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((error, response) => {
          response.body.should.be.an('object');
          done();
        });
    });

    it('POST to /rides should return with a message property', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((error, response) => {
          response.body.should.have.property('message');
          done();
        });
    });

    it('POST to /rides should return with a `success` as status', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((error, response) => {
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        });
    });

    it('POST to /rides returns the saved Ride object', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(ride)
        .end((error, response) => {
          response.body.should.have.property('data');
          response.body.data.should.have.property('destination');
          response.body.data.should.be.an('object');
          done();
        });
    });

    // testing bad data
    it('POST to /rides with missing required fields returns an object with errors property', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(badData)
        .end((error, response) => {
          response.body.should.have.property('errors');
          done();
        });
    });

    it('POST to /rides with missing required fields returns an object with `errors` property containing an object', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(badData)
        .end((error, response) => {
          response.body.errors.should.have.property('destination');
          response.body.errors.should.be.an('object');
          done();
        });
    });

    it('POST to /rides with missing required fields returns with an object property `status` equal to `failure`', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(badData)
        .end((error, response) => {
          response.body.should.have.property('status');
          response.body.status.should.have.equal('failure');
          done();
        });
    });

    it('POST to /rides with missing required fields returns with an object property `message` equal to `Required field(s) is/are missing`', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(badData)
        .end((error, response) => {
          response.body.should.have.property('message');
          response.body.message.should.have.equal('Required field(s) is/are missing');
          done();
        });
    });

    it('POST to /rides should return with a status code of 404:Bad Request', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(badData)
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });

    // Handles Fields with empty strings as values
    const emptyFields = {
      destination: '',
      time: '',
      date: '',
    };

    it('POST to /rides should return with a status code of 404:Bad Request for empty strings required property values', (done) => {
      chai.request(app)
        .post('/api/v1/rides')
        .send(emptyFields)
        .end((error, response) => {
          response.status.should.equal(404);
          done();
        });
    });
  });


  describe('POST /rides/<id>/request endpoint TESTS', () => {
    it('Post to /rides/<id>/request should return with a status code of 200', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .end((error, response) => {
          response.status.should.equal(200);
          done();
        });
    });

    it('Post to /rides/<id>/request should return an object', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .end((error, response) => {
          response.body.should.be.an('object');
          response.type.should.equal('application/json');
          done();
        });
    });

    it('Post to /rides/<id>/request should not return an error', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .end((error, response) => {
          should.not.exist(error);
          done();
        });
    });

    it('Post to /rides/<id>/request should return with a data object', (done) => {
      chai.request(app)
        .post('/api/v1/rides/3/request')
        .end((error, response) => {
          response.body.should.have.property('data');
          response.body.data.should.be.an('object');
          response.body.data.should.have.property('passenger');
          done();
        });
    });


    it('Post to /rides/<id>/request should return an object with `status` property equal to `success` when the ride offer is available or found', (done) => {
      chai.request(app)
        .post('/api/v1/rides/2/request')
        .end((error, response) => {
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        });
    });

    it('Post to /rides/<id>/request should return an object with `status` property equal to `failure` when the ride offer in question does not exist or is deleted', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56/request')
        .end((error, response) => {
          response.body.status.should.equal('failure');
          done();
        });
    });

    it('Post to /rides/<id>/request should return an object with `error` property equal to `Ride Not Found!` when the ride offer in question does not exist or is deleted', (done) => {
      chai.request(app)
        .post('/api/v1/rides/56/request')
        .end((error, response) => {
          response.body.should.have.property('error');
          response.body.error.should.equal('Ride Not Found!');
          done();
        });
    });
  });
});

