import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes, useLocation,
} from 'react-router-dom';
import PostPage from '../page/PostPage';
import { getPostById } from '../api/posts';
import { getProfileById } from '../api/user';
import { checkUserLiked } from '../api/like';
import { getCommentsByPostId } from '../api/comments';

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
  getPostById: jest.fn(),
}));

jest.mock('../api/like', () => ({
  checkUserLiked: jest.fn(),
}));

jest.mock('../api/comments', () => ({
  getCommentsByPostId: jest.fn(),
}));

describe('Post Page', () => {
  test('render the post page', async () => {
    getProfileById.mockResolvedValue({ follows: [] });
    getPostById.mockResolvedValue();
    checkUserLiked.mockResolvedValue([1]);
    getCommentsByPostId.mockResolvedValue([{
      commentId: 1,
      content: 'test comment',
      postDate: '2023-11-05T20:11:50.267+00:00',
      userId: 2,
    }]);
    const mockUserId = 1;
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route path="/post/:postid" element={<PostPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('post-page')).toBeInTheDocument();
    expect(screen.getByText('Back to Feed Page')).toBeInTheDocument();
  });

  test('render a post', async () => {
    const post = {
      userId: 1,
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: '',
      video: '',
      id: 1,
    };
    getProfileById.mockResolvedValue({ follows: [2] });
    getPostById.mockResolvedValue(post);
    checkUserLiked.mockResolvedValue([1]);
    getCommentsByPostId.mockResolvedValue([{
      commentId: 1,
      content: 'test comment',
      postDate: '2023-11-05T20:11:50.267+00:00',
      userId: 2,
    }]);
    const mockUserId = 1;
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route path="/post/:postid" element={<PostPage curUserId={mockUserId} />} />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('post-page')).toBeInTheDocument();
    expect(screen.getByText('Back to Feed Page')).toBeInTheDocument();
    const backToFeedBtn = screen.getByText('Back to Feed Page');
    fireEvent.click(backToFeedBtn);
    expect(testLocation.pathname).toBe('/activity');
  });
});
