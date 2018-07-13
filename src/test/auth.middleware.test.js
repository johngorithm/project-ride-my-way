/* globals describe, it  */

import chai, { expect, should } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
should();

describe('API AUTH MIDDLEWARE TEST', () => {
  describe('TOKEN VERIFICATION TESTS', () => {
    it('should fail when NO token is provided', (done) => {
      chai.request(app).get('/api/v1/rides').end((error, response) => {
        expect(response).to.have.status(403);
        response.body.should.have.property('error');
        response.body.status.should.equal(false);
        response.body.error.should.equal('No Access Token Provided');
        done();
      });
    });

    it('should fail when provided token has expired or is INVALID', (done) => {
      chai.request(app).get('/api/v1/rides').set('x-access-token', 'SOMEinvalidToken8973').end((error, response) => {
        expect(response).to.have.status(403);
        response.body.should.have.property('error');
        response.body.status.should.equal(false);
        response.body.error.should.equal('Invalid Or Expired Token');
        done();
      });
    });
  });
});
