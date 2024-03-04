import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes, useLocation,
} from 'react-router-dom';
import ActivityFeedRow from '../components/ActivityFeedRow';
import { getProfileById, updateFollowById } from '../api/user';

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
  updateFollowById: jest.fn(),
}));

describe('Activity Feed Row', () => {
  it('render the Activity Feed Row', async () => {
    getProfileById.mockResolvedValue({ firstName: 'jimmy', lastName: 'chen' });
    updateFollowById.mockResolvedValue();
    const mockUserId = '1';
    const mockPost = {
      userId: '1',
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: '',
      video: '',
      id: '1',
    };
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route
            path="/post/1"
            element={(
              <ActivityFeedRow
                postId={mockPost.id}
                userId={mockPost.userId}
                title={mockPost.title}
                content={mockPost.content}
                postDate={mockPost.postDate}
                image={mockPost.image}
                video={mockPost.video}
                curUserId={mockUserId}
                follows={[]}
                setFollows={jest.fn()}
              />
            )}
          />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed-row')).toBeInTheDocument();
    expect(screen.getByText('jimmy chen')).toBeInTheDocument();
    expect(screen.getByText('Me')).toBeInTheDocument();
    expect(screen.getByText('Post image and video')).toBeInTheDocument();
    expect(screen.getByText('Post image and video content.')).toBeInTheDocument();
  });

  it('post is not posted by current user', async () => {
    getProfileById.mockResolvedValue({ firstName: 'jimmy', lastName: 'chen' });
    updateFollowById.mockResolvedValue();
    const mockUserId = '2';
    const mockPost = {
      userId: '1',
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: '',
      video: '',
      id: '1',
    };
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route
            path="/post/1"
            element={(
              <ActivityFeedRow
                postId={mockPost.id}
                userId={mockPost.userId}
                title={mockPost.title}
                content={mockPost.content}
                postDate={mockPost.postDate}
                image={mockPost.image}
                video={mockPost.video}
                curUserId={mockUserId}
                follows={[]}
                setFollows={jest.fn()}
              />
            )}
          />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed-row')).toBeInTheDocument();
    expect(screen.getByText('jimmy chen')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('Post image and video')).toBeInTheDocument();
    expect(screen.getByText('Post image and video content.')).toBeInTheDocument();
  });

  it('post has already been followed by current user', async () => {
    getProfileById.mockResolvedValue({ firstName: 'jimmy', lastName: 'chen' });
    updateFollowById.mockResolvedValue();
    const mockUserId = '2';
    const mockPost = {
      userId: '1',
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: '',
      video: '',
      id: '1',
    };
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route
            path="/post/1"
            element={(
              <ActivityFeedRow
                postId={mockPost.id}
                userId={mockPost.userId}
                title={mockPost.title}
                content={mockPost.content}
                postDate={mockPost.postDate}
                image={mockPost.image}
                video={mockPost.video}
                curUserId={mockUserId}
                follows={['1']}
                setFollows={jest.fn()}
              />
            )}
          />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed-row')).toBeInTheDocument();
    expect(screen.getByText('jimmy chen')).toBeInTheDocument();
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
    expect(screen.getByText('Post image and video')).toBeInTheDocument();
    expect(screen.getByText('Post image and video content.')).toBeInTheDocument();
  });

  it('current user follow the post', async () => {
    const videoLink = 'http://media.w3.org/2010/05/sintel/trailer.webm';
    const imageLink = 'https://www.html.am/images/html-codes/links/boracay-white-beach-sunset-300x225.jpg';
    getProfileById.mockResolvedValue({ firstName: 'jimmy', lastName: 'chen' });
    updateFollowById.mockResolvedValue('1');
    const mockUserId = '2';
    const mockPost = {
      userId: '1',
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: imageLink,
      video: videoLink,
      id: '1',
    };
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post/1']}>
        <Routes>
          <Route
            path="/post/1"
            element={(
              <ActivityFeedRow
                postId={mockPost.id}
                userId={mockPost.userId}
                title={mockPost.title}
                content={mockPost.content}
                postDate={mockPost.postDate}
                image={mockPost.image}
                video={mockPost.video}
                curUserId={mockUserId}
                follows={[]}
                setFollows={jest.fn()}
              />
            )}
          />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed-row')).toBeInTheDocument();
    expect(screen.getByText('jimmy chen')).toBeInTheDocument();
    expect(screen.getByText('Follow')).toBeInTheDocument();
    expect(screen.getByText('Post image and video')).toBeInTheDocument();
    expect(screen.getByText('Post image and video content.')).toBeInTheDocument();

    const followBtn = screen.getByText('Follow');
    fireEvent.click(followBtn);
    waitFor(() => {
      const unfollowBtn = screen.getByText('Unfollow');
      expect(unfollowBtn).toBeInTheDocument();
    });
  });

  it('current user unfollow the post', async () => {
    getProfileById.mockResolvedValue();
    updateFollowById.mockResolvedValue('1');
    const mockUserId = '2';
    const mockPost = {
      userId: '1',
      title: 'Post image and video',
      content: 'Post image and video content.',
      postDate: '2020-04-01T04:00:00.000Z',
      image: '',
      video: '',
      id: '1',
    };
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/post']}>
        <Routes>
          <Route
            path="/post"
            element={(
              <ActivityFeedRow
                postId={mockPost.id}
                userId={mockPost.userId}
                title={mockPost.title}
                content={mockPost.content}
                postDate={mockPost.postDate}
                image={mockPost.image}
                video={mockPost.video}
                curUserId={mockUserId}
                follows={['1', '3']}
                setFollows={jest.fn()}
              />
            )}
          />
          <Route path="*" element={<LocationRecorder />} />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('activity-feed-row')).toBeInTheDocument();
    expect(screen.getByText('Unfollow')).toBeInTheDocument();
    expect(screen.getByText('Post image and video')).toBeInTheDocument();
    expect(screen.getByText('Post image and video content.')).toBeInTheDocument();

    const followBtn = screen.getByText('Unfollow');
    fireEvent.click(followBtn);
    waitFor(() => {
      const unfollowBtn = screen.getByText('Follow');
      expect(unfollowBtn).toBeInTheDocument();
    });

    const postLink = screen.getByText('Post image and video');
    fireEvent.click(postLink);
    expect(testLocation.pathname).toBe('/post/1');
  });
});
