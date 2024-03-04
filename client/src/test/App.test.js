import React from 'react';
import {
  render, waitFor, fireEvent, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../App';

describe('Login Page', () => {
  test('renders navbar with logo and login button', () => {
    // eslint-disable-next-line react/jsx-filename-extension
    render(<App />);
    expect(screen.getByAltText('pennLogo')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('renders login container with email, password inputs and login button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('renders the sign up redirect button', async () => {
    render(<App />);
    const signupButton = screen.getByText('No account? Signup');
    expect(signupButton).toBeInTheDocument();
    fireEvent.click(signupButton);
    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/sign_up');
    });
  });

  it('does not render the sidebar on the login', () => {
    render(<App />, { wrapperProps: { initialEntries: ['/'] } });
    expect(screen.queryByText('Feed')).not.toBeInTheDocument();
  });
});

describe('Signup Rendering Test', () => {
  it('does not render the sidebar on the signup page', () => {
    render(<App />, { wrapperProps: { initialEntries: ['/sign_up'] } });
    expect(screen.queryByText('Feed')).not.toBeInTheDocument();
  });

  test('renders navbar with logo and login button', () => {
    render(<App />, { wrapperProps: { initialEntries: ['/sign_up'] } });
    expect(screen.getByAltText('pennLogo')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('renders signup container with fir, last, email, password inputs and signup button', () => {
    render(<App />, { wrapperProps: { initialEntries: ['/sign_up'] } });
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders the log in redirect button', async () => {
    render(<App />, { wrapperProps: { initialEntries: ['/sign_up'] } });
    const signupButton = screen.getByText('Already have account? Login');
    expect(signupButton).toBeInTheDocument();
    fireEvent.click(signupButton);
    await waitFor(() => {
      expect(window.location.href).toBe('http://localhost/');
    });
  });
});
