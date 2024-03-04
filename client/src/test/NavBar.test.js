/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import {
  BrowserRouter, Routes, useLocation, Route,
} from 'react-router-dom';

import Navbar from '../components/Navbar';

jest.mock('../api/user', () => ({
  getProfileById: jest.fn(),
}));

let testLocation;
function LocationRecorder() {
  const location = useLocation();

  testLocation = location;

  return null;
}

describe('Test Navbar component', () => {
  const mockSetUserId = jest.fn();
  const loggedIn = 1;
  const loggedOut = '';

  test('render the navbar with user logged in', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedIn} setCurUserId={mockSetUserId} />
        </BrowserRouter>,
      );
    });

    expect(screen.getByAltText('pennLogo')).toBeInTheDocument();
    expect(screen.getByRole('button', { expanded: false })).toBeInTheDocument();
  });

  test('render the navbar with user not logged in', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedOut} setCurUserId={mockSetUserId} />
        </BrowserRouter>,
      );
    });

    expect(screen.getByAltText('pennLogo')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  test('throw an error when user id is invalid', async () => {
    const invalidId = -2;
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={invalidId} setCurUserId={mockSetUserId} />
        </BrowserRouter>,
      );
    });
  });

  test('click on logo redirect to the main page', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedIn} setCurUserId={mockSetUserId} />
          <Routes>
            <Route path="*" element={<LocationRecorder />} />
          </Routes>
        </BrowserRouter>,
      );
    });

    const button = screen.getByAltText('pennLogo');
    await act(() => {
      fireEvent.click(button);
    });

    expect(testLocation.pathname).toBe('/activity');
  });

  test('click on login redirect to the login page', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedOut} setCurUserId={mockSetUserId} />
          <Routes>
            <Route path="*" element={<LocationRecorder />} />
          </Routes>
        </BrowserRouter>,
      );
    });

    const button = screen.getByText('Log In');
    await act(() => {
      fireEvent.click(button);
    });

    expect(testLocation.pathname).toBe('/');
  });

  test('dropdown bar rendering', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedIn} setCurUserId={mockSetUserId} />
          <Routes>
            <Route path="*" element={<LocationRecorder />} />
          </Routes>
        </BrowserRouter>,
      );
    });

    const dropdown = screen.getByRole('button', { expanded: false });
    await act(() => {
      fireEvent.click(dropdown);
    });

    expect(screen.getByText('My Activity')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log Out/i })).toBeInTheDocument();
  });

  test('dropdown bar redirection works', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <Navbar curUserId={loggedIn} setCurUserId={mockSetUserId} />
          <Routes>
            <Route path="*" element={<LocationRecorder />} />
          </Routes>
        </BrowserRouter>,
      );
    });

    const dropdown = screen.getByRole('button', { expanded: false });
    await act(() => {
      fireEvent.click(dropdown);
    });

    const profileButton = screen.getByText('Profile');
    const LogoutButton = screen.getByRole('button', { name: /Log Out/i });
    const activityButton = screen.getByText('My Activity');

    await act(() => {
      fireEvent.click(profileButton);
    });
    expect(testLocation.pathname).toBe('/profile/1');

    await act(() => {
      fireEvent.click(activityButton);
    });
    expect(testLocation.pathname).toBe('/myActivity/1');

    fireEvent.click(LogoutButton);
    await act(() => {
      fireEvent.click(LogoutButton);
    });
    expect(testLocation.pathname).toBe('/');
    expect(mockSetUserId).toHaveBeenCalledWith('');
  });
});
