import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from '../page/LogIn';
import { accessProfile } from '../api/user';

jest.mock('../api/user', () => ({
  getUserId: jest.fn(),
  accessProfile: jest.fn(),
}));

describe('<Login />', () => {
  const mockSetCurUserId = jest.fn();

  let getItemSpy;

  beforeEach(() => {
    jest.clearAllMocks(); // clear any mocked return values before each test
    // Set up spies
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
    render(
      // eslint-disable-next-line react/jsx-filename-extension
      <Router>
        <Login setCurUserId={mockSetCurUserId} />
      </Router>,
    );
  });

  it('renders correctly', () => {
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText('No account? Signup')).toBeInTheDocument();
  });

  it('allows input of email and password', () => {
    act(() => {
      userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      userEvent.type(screen.getByPlaceholderText('Password'), '123');
    });

    expect(screen.getByPlaceholderText('Email').value).toBe('test@test.com');
    expect(screen.getByPlaceholderText('Password').value).toBe('123');
  });

  it('handles successful login', async () => {
    accessProfile.mockResolvedValueOnce({ success: true });

    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      userEvent.type(screen.getByPlaceholderText('Password'), '123');
      userEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(mockSetCurUserId).toHaveBeenCalledWith('');
    expect(accessProfile).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123',
    });
  });

  it('displays error for invalid credentials', async () => {
    accessProfile.mockResolvedValueOnce({ success: false, message: 'Invalid email or password' });

    await act(async () => {
      userEvent.type(screen.getByPlaceholderText('Email'), 'test@test.com');
      userEvent.type(screen.getByPlaceholderText('Password'), '123');
      userEvent.click(screen.getByRole('button', { name: /login/i }));
    });
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });

  it('fetches and sets user ID from local storage on render', () => {
    expect(getItemSpy).toHaveBeenCalledWith('curUserId');
  });

  it('navigates to signup on "No account? Signup" click', async () => {
    await act(async () => {
      userEvent.click(screen.getByText('No account? Signup'));
    });

    expect(window.location.pathname).toBe('/sign_up');
  });
});
