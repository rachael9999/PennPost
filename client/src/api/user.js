import axios from 'axios';
import rootURL from '../utils/url';
import axiosInstance from './axiosJWT';

export const updateProfile = async (id, data) => {
  try {
    await axiosInstance.patch(`${rootURL}/users/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return 1;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return -1; // Return -1 when user is not found
    }
    throw new Error(err.message);
  }
};

export const getProfileById = async (id) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/users/${id}`);
    return response.data.data.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return -1; // Return -1 when user is not found
    }
    throw new Error(err.message);
  }
};

export const updateFollowById = async (id, follows) => {
  try {
    const response = await axiosInstance.patch(
      `${rootURL}/users/${id}`,
      { follows },
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return -1; // Return -1 when id not valid
    }
    throw new Error(err.message);
  }
};

export const createUser = async (data) => {
  try {
    const response = await axios.post(`${rootURL}/users`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      follows: data.follows,
      phoneNumber: data.phoneNumber,
      photo: '',
      address1: 'Address Line 1',
      address2: 'Address Line 2',
      country: 'Country',
      area: 'State/Area',
      zipcode: 'Zip Code',
      school: 'Please Select Yout School',
      year: 'Please Select Your School Year',
      major: 'Your Major',
    });

    return response.data;
  } catch (err) {
    throw new Error(err.response ? err.response.data.message : 'Server error');
  }
};

export const accessProfile = async (credentials) => {
  try {
    const response = await axios.post(`${rootURL}/users/auth`, {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data && response.data.status === 'success') {
      // Store the token
      localStorage.setItem('jwtToken', response.data.token);
      return { success: true, data: response.data.data };
    }

    // Check if the response has a 401 status code
    if (response.data && response.data.message) {
      return { success: false, message: response.data.message };
    }

    return { success: false, message: response.data.message || 'An error occurred' };
  } catch (err) {
    throw new Error(err.response ? err.response.data.message : err.message);
  }
};

/**
* get all the users from the backend
*/
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${rootURL}/users`);
    return response.data.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

/**
 * update hide post by userid
 */
export const updateHidePostByUserId = async (userId, hide) => {
  try {
    const res = await axiosInstance.patch(`${rootURL}/users/${userId}`, {
      hiddenPosts: hide,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getFollowers = async (id) => {
  try {
    const response = await axiosInstance.get(`${rootURL}/users/followers/${id}`);
    return response.data.data.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
