var chai = require('chai');
const request = require('supertest');
const app = require('../server');
const sinon = require('sinon');
const db = require('../repository');

describe('GET /', function () {
  it('responds with json', function (done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /version', function () {
  it('responds with the current version', function (done) {
    request(app)
      .get('/version')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(JSON.parse(res.text)).to.eql({ version: '1.0.0' });
        return done();
      });
  });
});

describe('GET /events', function () {
  let dbStub;
  beforeEach(function() {
    dbStub = sinon.stub(db, "getEvents");
  });
  afterEach(function() {
    dbStub.restore();
  });
  it('responds with json', function (done) {
    dbStub.returns(Promise.resolve({ events: []}));
    request(app)
      .get('/events')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  it('returns events', function (done) {
    dbStub.returns(Promise.resolve({ events: []}));
    request(app)
      .get('/events')
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        chai.expect(JSON.parse(res.text)).to.have.property('events');
        return done();
      });
  });
});

describe('POST /event', function () {
  let dbStub;
  beforeEach(function() {
    dbStub = sinon.stub(db, "addEvent");
  });
  afterEach(function() {
    dbStub.restore();
  });
  it('adds an event', function (done) {
    dbStub.returns(Promise.resolve({ events: []}));
    request(app)
      .post('/event')
      .send({ title: 'a test event', description: 'a really cool test', location: 'Somewhere nice', likes: 0 })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('DELETE /event/like', function () {
  let dbStub;
  beforeEach(function() {
    dbStub = sinon.stub(db, "removeLike");
  });
  afterEach(function() {
    dbStub.restore();
  });
  it('un-likes an event', function (done) {
    dbStub.returns(Promise.resolve({ events: []}));
    request(app)
      .delete('/event/like')
      .send({ id: 2 })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});

describe('PUT /event/like', function () {
  let dbStub;
  beforeEach(function() {
    dbStub = sinon.stub(db, "addLike");
  });
  afterEach(function() {
    dbStub.restore();
  });
  it('likes an event', function (done) {
    dbStub.returns(Promise.resolve({ events: []}));
    request(app)
      .put('/event/like')
      .send({ id: 2 })
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});


