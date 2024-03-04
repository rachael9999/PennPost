const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { closeMongoDBConnection, connect } = require('../../dbFunctions');
const app = require('../../app');
const User = require('../../models/userModel');

describe('GET user endpoint integration test', () => {
  const rootURL = '/api';
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

    const res = await request(app).post(`${rootURL}/users`)
      .send(testHashed);
    // eslint-disable-next-line no-underscore-dangle
    testUserID = JSON.parse(res.text).data.userId;
    const loginRes = await request(app).post(`${rootURL}/users/auth`).send({ email: testUser.email, password: 'test' });
    authToken = loginRes.body.token; // save the token for future
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('userId');
  }, 20000);

  const clearDatabase = async () => {
    await User.deleteOne({ _id: testUserID });
  };
  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    try {
      await clearDatabase();
      await closeMongoDBConnection(); // mongo client that started server.
      return 1;
    } catch (err) {
      return err;
    }
  }, 20000);

  it('duplicate email', async () => {
    const res = await request(app).post(`${rootURL}/users`).send(testUser);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Email already exists in the database');
  }, 20000);

  it('incorrect email auth', async () => {
    const credentials = { email: 'test2@example.com', password: 'test' };
    const res = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Email does not exist');
  }, 20000);

  it('incorrect password auth', async () => {
    const credentials = { email: 'test1@gmail.com', password: 'wrongpassword' };
    const res = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Incorrect email or password. You have 4 more attempt(s)');
  }, 20000);

  it('incorrect password auth', async () => {
    const credentials = { email: 'test1@gmail.com', password: 'wrongpassword' };
    const res3 = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res3.statusCode).toBe(401);
    expect(res3.body.message).toBe('Incorrect email or password. You have 3 more attempt(s)');

    const res2 = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res2.statusCode).toBe(401);
    expect(res2.body.message).toBe('Incorrect email or password. You have 2 more attempt(s)');

    const res1 = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res1.statusCode).toBe(401);
    expect(res1.body.message).toBe('Incorrect email or password. You have 1 more attempt(s)');

    const res0 = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(res0.statusCode).toBe(401);
    expect(res0.body.message).toBe('Incorrect email or password. You have 0 more attempt(s). Your account is locked for 5 min due to too many failed login attempts');

    const resLocked = await request(app).post(`${rootURL}/users/auth`).send(credentials);
    expect(resLocked.statusCode).toBe(401);
    expect(resLocked.body.message).toBe('Your account is locked due to too many failed login attempts');
  }, 20000);

  it('fetch all users', async () => {
    const res = await request(app).get(`${rootURL}/users/`).set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.type).toBe('application/json');
    const UserArr = JSON.parse(res.text).data.data;

    // test user is in the response
    const expectedObject = {
      __v: 0,
      _id: testUserID,
      firstName: 'test',
      lastName: 'test',
      email: 'test1@gmail.com',
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
    expect(UserArr).toEqual(expect.arrayContaining([expect.objectContaining(expectedObject)]));
  }, 20000);

  it('get user profile', async () => {
    const res = await request(app).get(`${rootURL}/users/${testUserID}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.data).toHaveProperty('_id', testUserID);
  }, 20000);

  it('get fake user profile', async () => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`${rootURL}/users/${fakeUserId}`).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  }, 20000);

  it('update fake user profile', async () => {
    const updates = { firstName: 'updatedName' };
    const fakeUserId = new mongoose.Types.ObjectId();
    const res = await request(app).patch(`${rootURL}/users/${fakeUserId}`).send(updates).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  }, 20000);

  it('update profile', async () => {
    const updates = { firstName: 'updatedName' };
    const res = await request(app).patch(`${rootURL}/users/${testUserID}`).send(updates).set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.data.firstName).toBe(updates.firstName);
  }, 20000);

  it('invalid phone', async () => {
    const test2User = {
      firstName: 'test',
      lastName: 'test',
      email: 'test2@gmail.com',
      password: 'test',
      follows: [],
      phoneNumber: '1',
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
    const res = await request(app).post(`${rootURL}/users`).send(test2User);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Please enter a valid phone number');
  }, 20000);
});
