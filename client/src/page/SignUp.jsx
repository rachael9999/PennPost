import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/user';
import { encryptPassword } from './Encrpyt';
import '../style/SignUp.css';

function Signup() {
  const [errorMessage, setErrorMessage] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    follows: [],
  });

  const validateField = (name, value) => {
    if (!value) {
      return 'Missing input.';
    }

    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    if (name === 'password' && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value)) {
      return 'Password must be at least 8 characters, including one letter and one number';
    }
    return '';
  };

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    const error = validateField(name, value);
    setErrorMessage({
      ...errorMessage,
      [name]: error,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errorMessage).some((error) => error)) {
      return; // Stop the form submission if there are validation errors
    }

    const encryptedPassword = await encryptPassword(formData.password);

    try {
      await createUser({
        ...formData,
        password: encryptedPassword,
      });

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        follows: [],
      });

      navigate('/');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">
          Signup
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="phoneNumber"
            name="phoneNumber"
            placeholder="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="signup-input"
          />
          <div className="flex justify-center mt-2">
            {Object.keys(formData).map((key) => (
              errorMessage[key] && <p className="error-message">{errorMessage[key]}</p>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="signup-btn"
            >
              Sign Up
            </button>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="login-btn "
            >
              Already have account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
