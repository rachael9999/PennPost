import rootURL from '../utils/url';
import axiosInstance from './axiosJWT';

/**
 * This module contains HTTP calls to the backend about posts
 */

/**
 * get all the posts from the backend
 */
export const getAllPosts = async () => {
  try {
    const response = await axiosInstance.get(`${rootURL}/posts/`);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * get posts by page
 */
export const getPostsByPage = async (page, userid) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/posts/user/page/${userid}?page=${page}&sort=-postDate`);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Get a post by its id
 */
export const getPostById = async (postId) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/posts/${postId}`);
    return response.data.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Create a new post
 */
export const createNewPost = async (data) => {
  try {
    const response = await axiosInstance.post(`${rootURL}/posts`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.status;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * get posts by userId and page
 */
export const getAllPostsByUserPerPage = async (userId, page) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/posts/user/${userId}?page=${page}&sort=-postDate`);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * get number of post user has
 */
export const getPostNumByUser = async (userId) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/posts/num/user/${userId}`);
    return response.data.length;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * delete post by id
 */
export const deletePostByPostId = async (postId) => {
  try {
    await axiosInstance.delete(`${rootURL}/posts/${postId}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * update post by id
 */
export const updatePost = async (postId, data) => {
  try {
    const post = await axiosInstance.patch(`${rootURL}/posts/${postId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return post.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
