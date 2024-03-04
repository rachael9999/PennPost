import axiosInstance from './axiosJWT';

// eslint-disable-next-line import/no-named-as-default
import rootURL from '../utils/url';
/**
 * This module contains HTTP calls to the backend about comments
 */

/**
 * get comments by postId
 */
export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/comments?postId=${postId}&_sort=postDate&_order=desc`);
    return response.data.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Get a comment by its id
 */
export const getCommentById = async (id) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/comments/${id}`);
    return response.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Create a new comment
 */
export const createNewComment = async (commentObject) => {
  try {
    const response = await axiosInstance.post(`${rootURL}/comments`, {
      postId: commentObject.postId,
      userId: commentObject.userId,
      content: commentObject.content,
      postDate: commentObject.postDate,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * Update a comment
 */
export const updateComment = async (commentObject) => {
  try {
    const response = await axiosInstance.patch(`${rootURL}/comments/${commentObject.id}`, {
      content: commentObject.content,
    });
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * delete a comment by its id
 */
export const deleteCommentById = async (id) => {
  try {
    const response = await axiosInstance.delete(`${rootURL}/comments/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
