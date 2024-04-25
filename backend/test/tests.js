let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
const { expect } = chai;
chai.use(chaiHttp);

let jwtToken;

const testUser = {
  username: 'testuser', password: 'testpassword'
};

const wrongCredentials = {
    username: 'testuser', password: 'wrongpassword'
}

describe('POST /register', () => {
    it('should register a new user', (done) => {
        chai.request(server)
        .post('/register')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').equal('Käyttäjä luotu!');
            done();
        });
    });

    it('should reject registration if username or password is less than 4 characters', (done) => {
        chai.request(server)
        .post('/register')
        .send({ username: 'tes', password: '123' })
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error').equal('Käyttäjänimen ja salasanan on oltava 4 kirjainta tai enemmän!');
            done();
        });
    });

    it('should reject registration if username is already taken', (done) => {
        chai.request(server)
        .post('/register')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error').equal('Käyttäjänimi on varattu!');
            done();
        });
    });
});

describe('POST /login', () => {
    it('should log in an existing user', (done) => {
        chai.request(server)
        .post('/login')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('jwtToken');
            jwtToken = res.body.jwtToken;
            done();
        });
    });

    it('should not login user with wrong password', (done) => {
        chai.request(server)
        .post('/login')
        .send(wrongCredentials)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error').equal('User not authorized');
            done();
        });
    });
});

describe('DELETE /delete', () => {
    it('should delete the test user', (done) => {
        chai.request(server)
        .delete('/users/delete')
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').equal('You have deleted your account');
            done();
        });
    });

    it('should not delete the test user if no token in sessionstorage', (done) => {
        chai.request(server)
        .delete('/users/delete')
        .set('Authorization', 'Bearer ')
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error').equal('Access forbidden.');
            done();
        });
    });
});