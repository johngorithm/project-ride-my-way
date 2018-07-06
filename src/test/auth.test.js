/* globals describe, it, before, console  */

import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
should();

describe('TESTS FOR RIDE MY WAY API AUTH ENDPOINTS', () => {
  describe('Test: 404 Not Found', () => {
    it('should return a status Code of 404 for unknown route', (done) => {
      chai.request(app).get('/unknown').end((error, response) => {
        expect(response).to.have.status(404);
        done();
      });
    });
  });

  describe('SIGN UP ENDPOINT ROUTE', () => {
    it('should return successfully when all required credentials are provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'Agnes',
          lastname: 'Silas',
          username: 'agee2',
          email: 'silasviv@gmail.com',
          password: 'neme7jo@',
        })
        .end((error, response) => {
          expect(response).to.have.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(true);
          done();
        });
    });

    it('should return 400 : Bad Request when required credentials are not provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname: '',
          lastname: '',
          username: '',
          email: 'silas@gmail.com',
          password: 'neme',
        })
        .end((error, response) => {
          expect(response).to.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(false);
          done();
        });
    });

    it('should return 400 : Bad Request when no data is posted', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send()
        .end((error, response) => {
          expect(response).to.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(false);
          done();
        });
    });
  });

  describe('LOGIN ENDPOINT TEST', () => {
    it('should return successfully when valid data is sent, user authentication is successful and no server error accord', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: 'agee2',
          password: 'neme7jo@',
        })
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.be.an('object');
          expect(response.body).to.have.property('status');
          expect(response.body.status).to.equal(true);
          expect(response.body).to.have.property('user');
          expect(response.body.user).to.be.an('object');
          expect(response.body.user).to.have.property('username');
          expect(response.body.user.user_id).to.be.a('number');
          expect(response.body).to.have.ownProperty('token');
          expect(response.body.token.length).to.be.greaterThan(1);
          done();
        });
    });

    it('should return 400 : Bad Request when required credentials not are provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          username: '',
          password: '',
        })
        .end((error, response) => {
          expect(response).to.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(false);
          done();
        });
    });

    it('should return 400 : Bad Request when no data is posted', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send()
        .end((error, response) => {
          expect(response).to.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('status');
          response.body.status.should.equal(false);
          done();
        });
    });
  });
});
