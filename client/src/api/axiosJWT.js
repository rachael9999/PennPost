import axios from 'axios';
// import rootURL from '../utils/url';

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: rootURL,
  baseURL: '',
});

// Set up a request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken'); // Retrieve the stored token
  // Clone the config object
  const modifiedConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : config.headers.Authorization,
    },
  };

  return modifiedConfig;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response) => {
  // Check for new token in the response
  const newToken = response.headers.Authorization || response.data.newToken;
  if (newToken) {
    // Update the token in local storage
    localStorage.setItem('jwtToken', newToken.replace('Bearer ', ''));
  }
  return response;
}, (error) => Promise.reject(error));

export default axiosInstance;
