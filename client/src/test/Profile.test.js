/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import {
  screen, act, render, fireEvent, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Profile from '../page/ProfilePage';
import { getProfileById, updateProfile, getFollowers } from '../api/user';

jest.mock('../api/user', () => ({
  getProfileById: jest.fn(),
  updateProfile: jest.fn(),
  getFollowers: jest.fn(),
}));

global.alert = jest.fn();

const userProfile = {
  firstName: 'Haitian',
  lastName: 'Zhou',
  email: 'haitian@seas.upenn.edu',
  phoneNumber: '9999999999',
  photo: '',
  address1: '3720 Chestnut St',
  address2: '',
  country: 'United States',
  area: 'Pennsylvania',
  zipcode: '19104',
  school: 'School of Engineering and Applied Science',
  year: 'Master',
  major: 'Systems Engineering',
};

beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/some-blob-id');
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('Test Profile Page', () => {
  test('Profile page rendering', async () => {
    getProfileById.mockResolvedValue(userProfile);
    getFollowers.mockResolvedValue([]);

    await act(() => {
      render(
        <MemoryRouter initialEntries={['/profile/1']}>
          <Routes>
            <Route path="/profile/:userid" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    expect(screen.getByPlaceholderText('Haitian')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('United States')).toBeInTheDocument();
    expect(screen.getAllByRole('option', { name: 'Master' }).length).toEqual(2);
    expect(screen.getAllByRole('option', { name: 'School of Engineering and Applied Science' }).length).toEqual(2);
    expect(screen.getByRole('button', { name: 'Update Profile' })).toBeInTheDocument();
  });

  test('handle onchange and update profile', async () => {
    getProfileById.mockResolvedValue(userProfile);
    getFollowers.mockResolvedValue([]);

    await act(() => {
      render(
        <MemoryRouter initialEntries={['/profile/1']}>
          <Routes>
            <Route path="/profile/:userid" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const phoneNumberForm = screen.getByPlaceholderText('9999999999');
    const firstNameForm = screen.getByPlaceholderText('Haitian');
    const emailForm = screen.getByPlaceholderText('haitian@seas.upenn.edu');
    const address1Form = screen.getByPlaceholderText('3720 Chestnut St');
    const countryForm = screen.getByPlaceholderText('United States');
    const areaForm = screen.getByPlaceholderText(userProfile.area);
    const lastNameForm = screen.getByPlaceholderText('Zhou');
    const schoolSelect = screen.getAllByRole('combobox')[0];
    const yearSelect = screen.getAllByRole('combobox')[1];
    const majorForm = screen.getByPlaceholderText('Systems Engineering');

    await act(() => {
      fireEvent.change(phoneNumberForm, { target: { value: '3333333333' } });
      fireEvent.change(firstNameForm, { target: { value: 'testing' } });
      fireEvent.change(lastNameForm, { target: { value: 'test' } });
      fireEvent.change(emailForm, { target: { value: 'test@test.edu' } });
      fireEvent.change(address1Form, { target: { value: 'test location' } });
      fireEvent.change(countryForm, { target: { value: 'China' } });
      fireEvent.change(areaForm, { target: { value: 'test area' } });
      userEvent.selectOptions(schoolSelect, 'School of Arts and Sciences');
      userEvent.selectOptions(yearSelect, 'Ph.D');
      fireEvent.change(majorForm, { target: { value: 'CIS' } });
    });

    expect(screen.getByPlaceholderText('3333333333')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('testing')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument();
    expect(screen.getAllByRole('option', { name: 'School of Arts and Sciences' }).length).toEqual(2);
    expect(screen.getAllByRole('option', { name: 'Ph.D' }).length).toEqual(2);

    const updateButton = screen.getByRole('button', { name: 'Update Profile' });

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();

      const formDataArg = updateProfile.mock.calls[0][1];
      expect(formDataArg.get('firstName')).toBe('testing');
      expect(formDataArg.get('lastName')).toBe('test');
      expect(formDataArg.get('email')).toBe('test@test.edu');
      expect(formDataArg.get('phoneNumber')).toBe('3333333333');
      expect(formDataArg.get('address1')).toBe('test location');
      expect(formDataArg.get('address2')).toBe(userProfile.address2);
      expect(formDataArg.get('country')).toBe('China');
      expect(formDataArg.get('area')).toBe('test area');
      expect(formDataArg.get('zipcode')).toBe(userProfile.zipcode);
      expect(formDataArg.get('school')).toBe('School of Arts and Sciences');
      expect(formDataArg.get('year')).toBe('Ph.D');
      expect(formDataArg.get('major')).toBe('CIS');
    });
  });

  test('handles photo upload', async () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/some-blob-id');

    getProfileById.mockResolvedValue(userProfile);
    getFollowers.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/1']}>
          <Routes>
            <Route path="/profile/:userid" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const newPhoto = new File(['photo'], 'photo.png', { type: 'image/png' });

    const avatar = screen.getByTestId('PersonIcon');
    fireEvent.click(avatar);

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [newPhoto] } });

    const updateButton = screen.getByRole('button', { name: 'Update Profile' });

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled();
    });
  });

  test('polling logic triggers re-fetching of data', async () => {
    jest.useFakeTimers();
    getProfileById.mockResolvedValue(userProfile);
    getFollowers.mockResolvedValue([]);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/1']}>
          <Routes>
            <Route path="/profile/:userid" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    act(() => {
      jest.advanceTimersByTime(10000); // Advance the timers by 10 seconds
    });

    await waitFor(() => {
      expect(getFollowers).toHaveBeenCalledTimes(2);
    });

    jest.useRealTimers();
  });

  test('loads and displays follower data', async () => {
    getProfileById.mockResolvedValue(userProfile);
    const mockFollowers = [{ _id: '2', firstName: 'John', lastName: 'Doe' }];
    getFollowers.mockResolvedValue(mockFollowers);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/profile/1']}>
          <Routes>
            <Route path="/profile/:userid" element={<Profile />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    await waitFor(() => {
      mockFollowers.forEach((follower) => {
        // eslint-disable-next-line no-underscore-dangle
        expect(screen.getByText(`ID: ${follower._id} Name: ${follower.firstName} ${follower.lastName}`)).toBeInTheDocument();
      });
    });
  });
});
