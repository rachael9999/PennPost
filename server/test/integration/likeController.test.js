const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../app');
const { closeMongoDBConnection, connect } = require('../../dbFunctions');
const Like = require('../../models/likeModel');
const User = require('../../models/userModel');

describe('Like Controller', () => {
  const postId = '6548668b5d0eb81a0b55cb58';
  const userId = '6544626649d5303bac4270c7';
  let likeId;
  let testUserID;
  let authToken;

  const rootURL = '/api';
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
  }, 20000);

  const clearDatabase = async () => {
    await Like.deleteOne({ _id: likeId });
    await User.deleteOne({ _id: testUserID });
  };

  afterAll(async () => {
    try {
      await clearDatabase();
      await closeMongoDBConnection(); // mongo client that started server.
      return 1;
    } catch (err) {
      return err;
    }
  }, 20000);

  describe('POST /addLike', () => {
    it('should add a like to a post', async () => {
      const res = await request(app)
        .post('/api/like/addLike')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ postId, userId });

      // eslint-disable-next-line no-underscore-dangle
      likeId = res.body.data._id;

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('postId', postId);
      expect(res.body.data).toHaveProperty('userId', userId);
    });
  }, 20000);

  it('add duplicate like', async () => {
    const res = await request(app)
      .post('/api/like/addLike')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ postId, userId });

    expect(res.statusCode).toBe(400);
  }, 20000);

  describe('GET /like/count', () => {
    it('should get the like count for a post', async () => {
      const res = await request(app)
        .get('/api/like/like/count')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ postId });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBe(1);
    });
  }, 20000);

  describe('GET /like', () => {
    it('get user like', async () => {
      const res = await request(app)
        .get('/api/like/like')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ postId, userId });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBe(true);
    });
  }, 20000);

  describe('DELETE /removeLike', () => {
    it('should remove a like from a post', async () => {
      const res = await request(app)
        .delete('/api/like/removeLike')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ postId, userId });

      expect(res.statusCode).toBe(204);
    });
  }, 20000);

  describe('DELETE /removeLike invalid input', () => {
    it('should remove a like from a post', async () => {
      const fakeUser = '6544626649d5303b';
      const res = await request(app)
        .delete('/api/like/removeLike')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ postId, fakeUser });

      expect(res.statusCode).toBe(404);
    });
  }, 20000);

  describe('GET /like/count', () => {
    it('should get the like count for a post', async () => {
      const res = await request(app)
        .get('/api/like/like/count')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ postId });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBe(0);
    });
  }, 20000);
});
