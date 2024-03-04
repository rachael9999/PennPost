import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import {
  BrowserRouter, MemoryRouter, Route, Routes, useLocation,
} from 'react-router-dom';
import Signup from '../page/SignUp';
import { createUser } from '../api/user';
import { encryptPassword } from '../page/Encrpyt';

// this is for testing redirect
let testLocation;
function LocationRecorder() {
  const location = useLocation();

  testLocation = location;

  return null;
}
// Mocking API
jest.mock('../api/user', () => ({
  createUser: jest.fn(),
  emailExist: jest.fn(),
}));

jest.mock('../page/Encrpyt', () => ({
  encryptPassword: jest.fn(),
}));
describe('Signup', () => {
  it('render the signup form', () => {
    render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Already have account? Login')).toBeInTheDocument();

    const loginButton = screen.getByText('Already have account? Login');
    fireEvent.click(loginButton);
    expect(testLocation.pathname).toBe('/');
  });

  jest.mock('../api/user', () => ({
    emailExist: jest.fn(() => Promise.reject(new Error('General error'))),
    createUser: jest.fn(() => Promise.reject(new Error('General error'))),
  }));

  test('error--missing inputs', async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );
    const firstNameInput = screen.getByPlaceholderText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'test' } });
    fireEvent.change(firstNameInput, { target: { value: '' } });
    const signupButton = screen.getByText('Sign Up');
    fireEvent.click(signupButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Missing input.');
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it('sign up successfully', async () => {
    createUser.mockResolvedValue(true);

    encryptPassword.mockResolvedValue('11111aaaaa');

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');
    const emailInput = screen.getByPlaceholderText('Email');
    const phoneInput = screen.getByPlaceholderText('phoneNumber');
    const passwordInput = screen.getByPlaceholderText('Password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(firstNameInput, { target: { value: 'test' } });
    fireEvent.change(lastNameInput, { target: { value: 'test' } });
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(phoneInput, { target: { value: '1111111111' } });
    fireEvent.change(passwordInput, { target: { value: '11111aaaaa' } });

    fireEvent.click(signupButton);

    await waitFor(() => {
      // check sign up form
      expect(createUser).toHaveBeenCalledWith({
        firstName: 'test',
        lastName: 'test',
        email: 'test@test.com',
        password: '11111aaaaa',
        follows: [],
        phoneNumber: '1111111111',
      });

      // check redirect to root(login)
      expect(testLocation.pathname).toBe('/');
    });
  });
});
