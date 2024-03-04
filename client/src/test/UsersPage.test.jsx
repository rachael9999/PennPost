import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, act,
} from '@testing-library/react';
import { getAllUsers, getProfileById } from '../api/user';
import UsersPage from '../page/UsersPage';

// Mocking API
jest.mock('../api/user', () => ({
  getAllUsers: jest.fn(),
  getProfileById: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('Users Page', () => {
  it('render the users page', async () => {
    getAllUsers.mockResolvedValue([{ id: '1' }, { id: '2' }, { id: '3' }]);
    getProfileById.mockResolvedValue({ follows: ['1'] });
    const mockUserId = '1';
    await act(async () => render(
      <UsersPage curUserId={mockUserId} />,
    ));

    expect(screen.getByTestId('users-page')).toBeInTheDocument();
    expect(screen.getByText('Users:')).toBeInTheDocument();
  });

  it('renders correctly with an empty user list', async () => {
    getAllUsers.mockResolvedValue([]);
    getProfileById.mockResolvedValue({ follows: [] });
    const mockUserId = '1';

    await act(async () => render(<UsersPage curUserId={mockUserId} />));

    expect(screen.getByTestId('users-page')).toBeInTheDocument();
    expect(screen.getByText('Users:')).toBeInTheDocument();
  });

  it('renders UserRow components for each user', async () => {
    getAllUsers.mockResolvedValue([{ _id: '1', firstName: 'John', lastName: 'Doe' }, { _id: '2', firstName: 'Jane', lastName: 'Doe' }]);
    getProfileById.mockResolvedValue({ follows: ['1'] });

    await act(async () => render(<UsersPage curUserId="1" />));

    const followButton = screen.getByText(/Follow/i);
    expect(followButton).toBeInTheDocument();
  });
});
