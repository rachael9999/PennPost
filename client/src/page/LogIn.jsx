import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { accessProfile } from '../api/user';

import '../style/LogIn.css';

function Login(props) {
  const { setCurUserId } = props;
  const navigate = useNavigate();

  useEffect(() => {
    // Check if it's a fresh session
    if (!sessionStorage.getItem('sessionActive')) {
      localStorage.removeItem('curUserId');
      sessionStorage.setItem('sessionActive', 'true');
    }

    const savedUserId = localStorage.getItem('curUserId');
    const userId = savedUserId || '';
    setCurUserId(userId);
  }, [setCurUserId]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await accessProfile(formData);
      if (response.success) {
        const token = localStorage.getItem('jwtToken');

        // Decode the token to extract user information
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        setCurUserId(userId);
        localStorage.setItem('curUserId', userId);
        navigate('/activity');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />
          <div>
            <button
              type="submit"
              className="login-btn"
              data-testid="login-button"
            >
              Login
            </button>
          </div>
        </form>
        <div>
          <button
            type="button"
            onClick={() => navigate('/sign_up')}
            className="signup-btn"
          >
            No account? Signup
          </button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setCurUserId: PropTypes.func.isRequired,
};

export default Login;
