import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes, useLocation,
} from 'react-router-dom';
import ActivityFeedPage from '../page/ActivityFeedPage';
import { getPostsByPage, getPostById } from '../api/posts';
import { getProfileById } from '../api/user';

// this is for testing redirect
let testLocation;
function LocationRecorder() {
  const location = useLocation();

  testLocation = location;

  return null;
}
// Mocking API
jest.mock('../api/user', () => ({
  getProfileById: jest.fn(),
}));

jest.mock('../api/posts', () => ({
  getPostsByPage: jest.fn(),
  getPostById: jest.fn(),
}));

const mockPostsArr = {
  data: {
    data:
      [
        {
          _id: '1',
          userId: '1',
          title: 'json-server',
          content: 'hello world!',
          postDate: '2023-10-11T09:15:27+00:00',
          image: '',
          video: '',
        },
      ],
  },
};

const mockHiddenPost = {
  _id: '2',
  userId: '2',
  title: 'hidden post',
  content: 'hidden',
  postDate: '2023-10-11T09:15:27+00:00',
  image: '',
  video: '',
};

describe('Activity Feed Page', () => {
  it('render the activity feed page', async () => {
    getProfileById.mockResolvedValue({
      follows: ['2'],
      hiddenPosts: ['2'],
    });
    getPostsByPage.mockResolvedValue(mockPostsArr);
    getPostById.mockResolvedValue(mockHiddenPost);
    const mockUserId = '1';
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/activity']}>
        <Routes>
          <Route path="/activity" element={<ActivityFeedPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed')).toBeInTheDocument();
    expect(screen.getByTestId('create-post-btn')).toBeInTheDocument();

    act(() => {
      fireEvent.scroll(window);
    });

    const createPostButton = screen.getByText('Create Post');
    fireEvent.click(createPostButton);
    expect(testLocation.pathname).toBe('/create_post');
  });

  test('test activity feed show all post/following post/hidden post btn', async () => {
    getProfileById.mockResolvedValue({
      follows: ['2'],
      hiddenPosts: ['2'],
    });
    getPostsByPage.mockResolvedValue(mockPostsArr);
    getPostById.mockResolvedValue(mockHiddenPost);
    const mockUserId = '1';
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/activity']}>
        <Routes>
          <Route path="/activity" element={<ActivityFeedPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    const followingPostsButton = screen.getByText('Following Posts');

    act(() => {
      fireEvent.click(followingPostsButton);
    });

    expect(screen.getByText('All Posts')).toBeInTheDocument();

    const allPostsButton = screen.getByText('All Posts');

    act(() => {
      fireEvent.click(allPostsButton);
    });

    expect(screen.getByText('Following Posts')).toBeInTheDocument();

    const hiddenPostsButton = screen.getByText('Hidden Posts');

    act(() => {
      fireEvent.click(hiddenPostsButton);
    });

    expect(screen.getByText('hidden post')).toBeInTheDocument();
  });

  test('get page fail by hitting end', async () => {
    getProfileById.mockResolvedValue({
      follows: ['2'],
      hiddenPosts: ['2'],
    });
    getPostsByPage.mockResolvedValue([]);
    getPostById.mockResolvedValue(mockHiddenPost);
    const mockUserId = '1';
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/activity']}>
        <Routes>
          <Route path="/activity" element={<ActivityFeedPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));
    expect(screen.getByText('Hit end!')).toBeInTheDocument();
  });

  test('get page fail by api failure', async () => {
    getProfileById.mockResolvedValue();
    getPostsByPage.mockResolvedValue(Promise.reject());
    const mockUserId = '1';
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/activity']}>
        <Routes>
          <Route path="/activity" element={<ActivityFeedPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));
    expect(screen.getByText('Hit end!')).toBeInTheDocument();
  });
});
