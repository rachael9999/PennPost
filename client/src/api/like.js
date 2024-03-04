import rootURL from '../utils/url';
import axiosInstance from './axiosJWT';

export const addLike = async (postId, userId) => {
  try {
    const response = await axiosInstance.post(`${rootURL}/like/addLike`, { postId, userId });
    return response.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const removeLike = async (postId, userId) => {
  try {
    const like = await axiosInstance.get(`${rootURL}/like/like?postId=${postId}&userId=${userId}`);
    if (like.data) {
      await axiosInstance.delete(`${rootURL}/like/removeLike?postId=${postId}&userId=${userId}`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

export const checkUserLiked = async (postId, userId) => {
  try {
    const likes = await axiosInstance.get(`${rootURL}/like/like?postId=${postId}&userId=${userId}`);
    return likes.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getLikeCount = async (postId) => {
  try {
    const likes = await axiosInstance.get(`${rootURL}/like/like/count?postId=${postId}`);
    return likes.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
