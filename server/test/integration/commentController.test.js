const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { closeMongoDBConnection, connect } = require('../../dbFunctions');
const app = require('../../app');
const Comment = require('../../models/commentModel');
const User = require('../../models/userModel');

// TEST post a comment and get comment
describe('GET comment(s) endpoint integration test', () => {
  const userId = new mongoose.Types.ObjectId();
  const postId = new mongoose.Types.ObjectId();
  const postDate = new Date();
  const postDateString = postDate.toISOString();
  const rootURL = '/api';
  let testCommentID;
  let testUserID;
  let authToken;

  // test resource to create / expected response

  const testUser = {
    firstName: 'test',
    lastName: 'test',
    email: 'test1@gmail.com',
    password: 'test',
    follows: [],
    phoneNumber: '1111111111',
    photo: '',
    address1: 'Address Line 1',
    address2: 'Address Line 2',
    country: 'Country',
    area: 'State/Area',
    zipcode: 'Zip Code',
    school: 'Please Select Yout School',
    year: 'Please Select Your School Year',
    major: 'Your Major',
  };
  // test resource to create / expected response
  const testComment = {
    postId,
    userId,
    content: 'test comment',
    postDate,
  };
  /**
     * Make sure that the data is in the DB before running
     * any test
     * connect to the DB
     */
  beforeAll(async () => {
    await connect();

    const hashedPassword = await bcrypt.hash('test', 12);

    const testHashed = {
      ...testUser,
      password: hashedPassword,
    };

    const resSign = await request(app).post(`${rootURL}/users`)
      .send(testHashed);
    // eslint-disable-next-line no-underscore-dangle
    testUserID = JSON.parse(resSign.text).data.userId;
    const loginRes = await request(app).post(`${rootURL}/users/auth`).send({ email: testUser.email, password: 'test' });
    authToken = loginRes.body.token; // save the token for future

    const res = await request(app).post(`${rootURL}/comments`)
      .send(testComment).set('Authorization', `Bearer ${authToken}`);
    // eslint-disable-next-line no-underscore-dangle
    testCommentID = JSON.parse(res.text).data.data._id;
  }, 20000);

  const clearDatabase = async () => {
    await Comment.deleteOne({ _id: testCommentID });
    await User.deleteOne({ _id: testUserID });
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await clearDatabase();
    try {
      await closeMongoDBConnection(); // mongo client that started server.
      return 1;
    } catch (err) {
      return err;
    }
  }, 20000);

  test('Get all comments by post id', async () => {
    const resp = await request(app).get(`${rootURL}/comments?postId=${postId}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(commentArr).toMatchObject([{
      __v: 0,
      _id: testCommentID,
      postId: postId.toString(),
      userId: userId.toString(),
      content: 'test comment',
      postDate: postDateString,
    }]);
  }, 20000);

  test('Get a comment endpoint status code and data', async () => {
    const resp = await request(app).get(`${rootURL}/comments/${testCommentID}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(commentArr).toMatchObject({
      __v: 0,
      _id: testCommentID,
      postId: postId.toString(),
      userId: userId.toString(),
      content: 'test comment',
      postDate: postDateString,
    });
  }, 20000);

  test('comment not in db status code 404', async () => {
    const resp = await request(app).get(`${rootURL}/comments/1`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  }, 20000);

  test('comments with Post Id not in db status code 404', async () => {
    const resp = await request(app).get(`${rootURL}/comments?postId=1`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
  }, 20000);

  test('update comment in db status code 200', async () => {
    const resp = await request(app).patch(`${rootURL}/comments/${testCommentID}`)
      .send({ content: 'test update' }).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');

    const result = await Comment.findOne({ _id: testCommentID });
    expect(result.content).toBe('test update');
  }, 20000);

  test('delete comment in db status code 200', async () => {
    const resp2 = await request(app).post(`${rootURL}/comments`)
      .send(testComment).set('Authorization', `Bearer ${authToken}`);
    // eslint-disable-next-line no-underscore-dangle
    const testDeleteCommentID = JSON.parse(resp2.text).data.data._id;

    const resp = await request(app).delete(`${rootURL}/comments/${testDeleteCommentID}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');

    const result = await Comment.findOne({ _id: testDeleteCommentID });
    expect(result).toBe(null);

    const resp3 = await request(app).delete(`${rootURL}/comments/${testDeleteCommentID}`).set('Authorization', `Bearer ${authToken}`);
    expect(JSON.parse(resp3.text).data.data.deletedCount).toBe(0);
  }, 20000);
});
