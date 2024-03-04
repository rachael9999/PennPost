import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import { updateFollowById } from '../api/user';
import UserRow from '../components/UserRow';

// Mocking API
jest.mock('../api/user', () => ({
  updateFollowById: jest.fn(),
}));

describe('User Row', () => {
  it('render the user row', async () => {
    const curUserId = '1';
    const userId = '1';
    const name = 'jimmy chen';
    const follows = [];
    const setFollows = jest.fn();
    updateFollowById.mockResolvedValue();
    await act(async () => render(
      <UserRow
        curUserId={curUserId}
        userId={userId}
        name={name}
        follows={follows}
        setFollows={setFollows}
      />,
    ));

    expect(screen.getByText(`ID:${userId}`)).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
  });

  it('follow user', async () => {
    const curUserId = '1';
    const userId = '2';
    const name = 'jimmy chen';
    const follows = [];
    const setFollows = jest.fn();
    updateFollowById.mockResolvedValue();
    await act(async () => render(
      <UserRow
        curUserId={curUserId}
        userId={userId}
        name={name}
        follows={follows}
        setFollows={setFollows}
      />,
    ));

    expect(screen.getByText(`ID:${userId}`)).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();

    const followBtn = screen.getByText('Follow');
    await act(async () => {
      fireEvent.click(followBtn);
    });
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
  });

  it('unfollow user', async () => {
    const curUserId = '1';
    const userId = '2';
    const name = 'jimmy chen';
    const follows = ['2', '3'];
    const setFollows = jest.fn();
    updateFollowById.mockResolvedValue();
    await act(async () => render(
      <UserRow
        curUserId={curUserId}
        userId={userId}
        name={name}
        follows={follows}
        setFollows={setFollows}
      />,
    ));

    expect(screen.getByText(`ID:${userId}`)).toBeInTheDocument();
    expect(screen.getByText('Unfollow')).toBeInTheDocument();

    const followBtn = screen.getByText('Unfollow');
    await act(async () => {
      fireEvent.click(followBtn);
    });
    expect(screen.getByText('Follow')).toBeInTheDocument();
  });
});
