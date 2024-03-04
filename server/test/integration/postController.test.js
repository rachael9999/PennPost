const mongoose = require('mongoose');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const { closeMongoDBConnection, connect } = require('../../dbFunctions');
const app = require('../../app');
const Post = require('../../models/postModel');
const User = require('../../models/userModel');
const { deleteFile } = require('../../utils/s3Operations');

// TEST post a post and get the post
describe('GET post(s) endpoint integration test', () => {
  const userId = new mongoose.Types.ObjectId();
  const title = 'Test Title';
  const content = 'Test content.';
  const postDate = new Date();
  const postDateString = postDate.toISOString();
  const video = `${__dirname}/source/test_video.mp4`;
  const image = `${__dirname}/source/test_img.jpg`;
  const rootURL = '/api';
  let testPostID;
  let testImage;
  let testVideo;

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

    const resSign = await request(app).post(`${rootURL}/users`)
      .send(testHashed);
    // eslint-disable-next-line no-underscore-dangle
    testUserID = JSON.parse(resSign.text).data.userId;
    const loginRes = await request(app).post(`${rootURL}/users/auth`).send({ email: testUser.email, password: 'test' });
    authToken = loginRes.body.token; // save the token for future

    const res = await request(app).post(`${rootURL}/posts`)
      .field('userId', userId.toString())
      .field('title', title)
      .field('content', content)
      .field('postDate', postDateString)
      .attach('image', image)
      .attach('video', video)
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${authToken}`);
    // eslint-disable-next-line no-underscore-dangle
    testPostID = JSON.parse(res.text).data.data._id;
    testImage = JSON.parse(res.text).data.data.image;
    testVideo = JSON.parse(res.text).data.data.video;
  }, 20000);

  const clearDatabase = async () => {
    await Post.deleteOne({ _id: testPostID });
    await deleteFile(testImage);
    await deleteFile(testVideo);
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

  test('Get posts by userId and page', async () => {
    const resp = await request(app).get(`${rootURL}/posts/user/${userId}?page=1&sort=-postDate`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(commentArr.length >= 1).toBe(true);
  }, 20000);

  test('Get posts by userId', async () => {
    const resp = await request(app).get(`${rootURL}/posts/user/${userId}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(commentArr.length >= 1).toBe(true);
  }, 20000);

  test('Get a post by id endpoint status code and data', async () => {
    const resp = await request(app).get(`${rootURL}/posts/${testPostID}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const result = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(result).toMatchObject({
      __v: 0,
      _id: testPostID,
      title,
      content,
      userId: userId.toString(),
      postDate: postDateString,
    });
  }, 20000);

  test('post not in db status code 404', async () => {
    const notExistPostId = new mongoose.Types.ObjectId();
    const resp = await request(app).get(`${rootURL}/posts/${notExistPostId}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
    // test invalid id
    const resp2 = await request(app).get(`${rootURL}/posts/1`).set('Authorization', `Bearer ${authToken}`);
    expect(resp2.status).toEqual(500);
  }, 20000);

  test('Get post number by user endpoint status code and data', async () => {
    const resp = await request(app).get(`${rootURL}/posts/num/user/${userId}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const result = JSON.parse(resp.text).data.data;
    // test comment is in the response
    expect(result.length).toBe(1);
  }, 20000);

  test('Delete post endpoint status code and data', async () => {
    const resp2 = await request(app).post(`${rootURL}/posts`)
      .field('userId', userId.toString())
      .field('title', title)
      .field('content', content)
      .field('postDate', postDateString)
      .field('image', '')
      .field('video', '')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${authToken}`);
    // eslint-disable-next-line no-underscore-dangle
    const testPostID2 = JSON.parse(resp2.text).data.data._id;

    const resp = await request(app).delete(`${rootURL}/posts/${testPostID2}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(204);
  }, 20000);

  test('Update post endpoint status code and data', async () => {
    const resp = await request(app).patch(`${rootURL}/posts/${testPostID}`)
      .field('title', 'update title')
      .field('content', 'update content')
      .field('image', '')
      .field('video', '')
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${authToken}`);
    expect(resp.status).toEqual(200);

    const resp2 = await request(app).get(`${rootURL}/posts/${testPostID}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp2.status).toEqual(200);
    expect(resp2.type).toBe('application/json');
    const result = JSON.parse(resp2.text).data.data;
    // test comment is in the response
    expect(result).toMatchObject({
      __v: 0,
      _id: testPostID,
      title: 'update title',
      content: 'update content',
      userId: userId.toString(),
      postDate: postDateString,
    });

    const resp3 = await request(app).patch(`${rootURL}/posts/${testPostID}`)
      .field('title', 'update title')
      .field('content', 'update content')
      .attach('image', image)
      .attach('video', video)
      .set('Content-Type', 'multipart/form-data')
      .set('Authorization', `Bearer ${authToken}`);
    expect(resp3.status).toEqual(200);

    const resp4 = await request(app).get(`${rootURL}/posts/${testPostID}`).set('Authorization', `Bearer ${authToken}`);
    expect(resp4.status).toEqual(200);
    expect(resp4.type).toBe('application/json');
    // test comment is in the response
    const curTestImage = JSON.parse(resp4.text).data.data.image;
    const curTestVideo = JSON.parse(resp4.text).data.data.video;
    expect(curTestImage).not.toBe('');
    expect(curTestVideo).not.toBe('');
    expect(curTestImage).not.toBe(testImage);
    expect(curTestVideo).not.toBe(testVideo);
    await deleteFile(curTestImage);
    await deleteFile(curTestVideo);
  }, 20000);
});
