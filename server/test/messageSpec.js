const expect = require('chai').expect;
const Promise = require('bluebird');
const supertest = require('supertest');
const server = require('./../server');
const testUtil = require('./testUtil');
const dbUtil = require('./../db/dbUtil');

const request = supertest.agent(server);


let userId1, userId2, token1, token2, company1;
const messageText1 = 'This is a message';
const messageText2 = 'Hello world';



describe('Message Server API tests', () => {


  before( function(done) {
    this.timeout(4000);

    testUtil.clearDatabase().then( () => { 
      Promise.all([
        testUtil.signupUser1(request), 
        testUtil.signupUser2(request), 
        testUtil.signupMover1(request)
      ])
      .then( result => {
        token1 = result[0].token;
        token2 = result[1].token;
        userId1 = result[0]._id;
        userId2 = result[1]._id;
        company1 = result[2].company;
        done();
      });
    });
  });


  it('Should send a message between a user and a company', (done) => {
    const messageObj = {
      sourceId: userId1,
      company: company1,
      text: messageText1
    };
    request.post('/api/message/newMessage')
    .set('x-access-token', token1)
    .send(messageObj)
    .end( (err, res) => {
      expect(res.body.text).to.equal(messageText1);
      expect(res.body.user_id).to.equal(String(userId1));
      expect(res.body.company).to.equal(String(company1));
      done();
    });
  });


  it('Should send a second between a user and a company', (done) => {
    const messageObj = {
      sourceId: userId1,
      company: company1,
      text: messageText2
    };
    request.post('/api/message/newMessage')
    .set('x-access-token', token1)
    .send(messageObj)
    .end( (err, res) => {
      expect(res.body.text).to.equal(messageText2);
      done();
    });
  });


  it('Should load all messages between a user and a company', (done) => {
    request.get('/api/message/conversation')
    .set('x-access-token', token1)
    .send({company: company1})
    .end( (err, res) => {
      const messages = res.body.messages;
      expect(messages.length).to.equal(2);
      //most recent at the head
      expect(messages[0].text).to.equal(messageText2);
      expect(messages[1].text).to.equal(messageText1);
      done();
    });
  });

  it('Should not get messages for other users', (done) => {
    request.get('/api/message/conversation')
    .set('x-access-token', token2)
    .send({company: company1})
    .end( (err, res) => {
      const messages = res.body.messages;
      expect(messages.length).to.equal(0);
      done();
    });
  });

});
