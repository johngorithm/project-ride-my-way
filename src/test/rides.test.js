
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

    it('/rides/<id> should return only 1 object with 4 properties', (done) => {
      chai.request(app).get('/api/v1/rides/1').end((error, response) => {
        Object.keys(response.body).length.should.equal(4);
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
  });

  describe('POST /rides endpoint TESTS', () => {
    const ride = {
      destination: 'Oja',
      time: '5:00 PM',
      data: '30/6/2018',
      driver: 'New Man',
    };

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
  });

  describe('POST /rides/<id>/request endpoint TESTS', () => {
    const request = {
      passenger: 'Annabel',
    };
    it('Post to /rides/<id>/request should return with a status code of 200', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          response.status.should.equal(200);
          done();
        });
    });

    it('Post to /rides/<id>/request should return an object', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          response.body.should.be.an('object');
          response.type.should.equal('application/json');
          done();
        });
    });

    it('Post to /rides/<id>/request should not return an error', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          should.not.exist(error);
          done();
        });
    });

    it('Post to /rides/<id>/request should return with a data object', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          response.body.should.have.property('data');
          response.body.data.should.be.an('object');
          response.body.data.should.have.property('passenger');
          done();
        });
    });

    it('Post to /rides/<id>/request should have a value for it\'s ride id', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          response.body.data.should.have.property('ride_id');
          response.body.data.ride_id.should.be.greaterThan(0);
          done();
        });
    });

    it('Post to /rides/2/request should return 2 as it\'s ride\'s id for the request', (done) => {
      chai.request(app)
        .post('/api/v1/rides/2/request')
        .send(request)
        .end((error, response) => {
          response.body.data.ride_id.should.equal(2);
          done();
        });
    });

    it('Post to /rides/<id>/request serve `status` should be `success`', (done) => {
      chai.request(app)
        .post('/api/v1/rides/1/request')
        .send(request)
        .end((error, response) => {
          response.body.should.have.property('status');
          response.body.status.should.equal('success');
          done();
        });
    });
  });
});

