import axios from 'axios';
import {
  getProfileById, createUser, getAllUsers, updateProfile,
} from '../api/user';

import {
  getAllPosts, getPostsByPage, getPostById, createNewPost,
} from '../api/posts';

jest.mock('axios');

describe('API Error Handling Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('update with an invalid id', async () => {
    const data = {
      firstName: 'test',
    };

    const res = await updateProfile(100, data);
    expect(res).toEqual(1);
  });

  test('get profile by id should handle server errors', async () => {
    axios.get.mockRejectedValue(new Error('Server error'));

    await expect(getProfileById(1)).rejects.toThrow('Server error');
  });

  test('update profile by id should handle error', async () => {
    axios.patch.mockRejectedValue(new Error('Server error'));

    await expect(updateProfile(1, { firstName: 'test' })).rejects.toThrow('Server error');
  });

  test('create user should handle server errors', async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {},
        status: 500,
        statusText: 'Server Error',
      },
    });

    const user = {
      firstName: 'testuser',
      lastName: 'test',
      email: 'xxx@xxx.com',
    };
    await expect(createUser({ user })).rejects.toThrow('');
  });

  test('get all users should handle server errors', async () => {
    axios.get.mockRejectedValue(new Error('Server error'));

    await expect(getAllUsers()).rejects.toThrow('Server error');
  });

  test('get all posts should handle server errors', async () => {
    axios.get.mockRejectedValue(new Error('Server error'));

    await expect(getAllPosts()).rejects.toThrow('Server error');
  });

  test('get post by page should handle server errors', async () => {
    axios.get.mockRejectedValue(new Error('Server error'));

    await expect(getPostsByPage(1)).rejects.toThrow('Server error');
  });

  test('get post by id should handle server errors', async () => {
    axios.get.mockRejectedValue(new Error('Server error'));

    await expect(getPostById(1)).rejects.toThrow('Server error');
  });

  test('create new post should handle server errors', async () => {
    axios.post.mockRejectedValue(new Error('Server error'));
    const mockPost = {
      id: 1,
      userId: 1,
      title: 'title',
      content: 'content',
      postDate: new Date(),
      image: '',
      video: '',
    };

    await expect(createNewPost(mockPost)).rejects.toThrow('Server error');
  });
});
