import '@testing-library/jest-dom'; // This imports the custom matchers

import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import CreatePostPage from '../page/CreatePostPage';
import { createNewPost, getPostById, updatePost } from '../api/posts';

// Mocking API
jest.mock('../api/posts', () => ({
  createNewPost: jest.fn(),
  getPostById: jest.fn(),
  updatePost: jest.fn(),
}));

describe('Create Post Page', () => {
  it('render the create post page', async () => {
    const mockUserId = 1;
    render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('create-post-page')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Upload Image')).toBeInTheDocument();
    expect(screen.getByText('Upload Video')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  test('Create a post', async () => {
    const mockUserId = '1';
    await act(() => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const titleText = screen.getByPlaceholderText('title');
    const contentText = screen.getByPlaceholderText('content');
    const submitBtn = screen.getByText('Submit');
    fireEvent.change(titleText, { target: { value: 'Post image and video' } });
    fireEvent.change(contentText, { target: { value: 'Post image and video content.' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(createNewPost).toHaveBeenCalled();

      const formDataArg = createNewPost.mock.calls[0][0];

      expect(formDataArg.get('userId')).toBe(mockUserId);
      expect(formDataArg.get('title')).toBe('Post image and video');
      expect(formDataArg.get('content')).toBe('Post image and video content.');
      expect(formDataArg.get('postDate')).toBe('2020-04-01T04:00:00.000Z');

      expect(screen.getByText('Back to Feed Page')).toBeInTheDocument();
    });
  });

  test('handles invalid file upload', async () => {
    const mockUserId = '1';
    const invalidFile = new File(['(⌐□_□)'], 'invalidfile.txt', { type: 'text/plain' });

    await act(async () => render(
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const imageInput = screen.getByLabelText('Upload Image');
    fireEvent.change(imageInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText('Please upload an image')).toBeInTheDocument();
    });
  });

  test('handles image upload', async () => {
    const mockUserId = '1';
    const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    await act(async () => render(
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const fileInput = screen.getByLabelText('Upload Image');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.queryByText('Please upload an image')).not.toBeInTheDocument();
    });
  });

  test('handles video upload', async () => {
    const mockUserId = '1';
    const videoFile = new File(['(⌐□_□)'], 'example.mp4', { type: 'video/mp4' });

    await act(async () => render(
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const videoInput = screen.getByLabelText('Upload Video');
    fireEvent.change(videoInput, { target: { files: [videoFile] } });

    await waitFor(() => {
      expect(screen.queryByText('Please upload a video')).not.toBeInTheDocument();
    });
  });

  test('handles large image upload', async () => {
    const mockUserId = '1';

    const buffer = Buffer.alloc(100 * 1024 * 1024, 'a');
    const file = new File([buffer], 'large_image.jpg', { type: 'image/jpeg' });

    await act(async () => render(
      <MemoryRouter initialEntries={['/create_post']}>
        <Routes>
          <Route path="/create_post" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const imageInput = screen.getByLabelText('Upload Image');
    fireEvent.change(imageInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Image size should be less than 50 MB')).toBeInTheDocument();
    });
  });
});

describe('edit post page', () => {
  test('render the edit post page', async () => {
    getPostById.mockResolvedValue({
      _id: '1',
      userId: '2',
      title: 'test post',
      content: 'testing',
      postDate: '2023-11-08T20:27:16.793+00:00',
      image: '',
      video: '',
    });
    const mockUserId = '1';

    await act(async () => {
      render(
        // eslint-disable-next-line react/jsx-filename-extension
        <MemoryRouter initialEntries={['/edit_post/1']}>
          <Routes>
            <Route path="/edit_post/:postid" element={<CreatePostPage curUserId={mockUserId} />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    expect(screen.getByPlaceholderText('test post')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('testing')).toBeInTheDocument();

    const titleText = screen.getByPlaceholderText('test post');
    const contentText = screen.getByPlaceholderText('testing');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(titleText, { target: { value: 'test title changed' } });
      fireEvent.change(contentText, { target: { value: 'test content changed' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(updatePost).toHaveBeenCalled();

      const formDataArg = updatePost.mock.calls[0][1];

      expect(formDataArg.get('title')).toBe('test title changed');
      expect(formDataArg.get('content')).toBe('test content changed');
    });
  });

  test('handles video upload in edit mode', async () => {
    // Mock the API call to get post details
    getPostById.mockResolvedValue({
      _id: '1',
      userId: '2',
      title: 'test post',
      content: 'testing',
      postDate: '2023-11-08T20:27:16.793+00:00',
      image: '',
      video: '',
    });

    const mockUserId = '1';
    const mockPostId = '123';

    const videoFile = new File(['(⌐□_□)'], 'new-video.mp4', { type: 'video/mp4' });

    await act(async () => render(
      <MemoryRouter initialEntries={[`/edit_post/${mockPostId}`]}>
        <Routes>
          <Route path="/edit_post/:postid" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const submitButton = screen.getByText('Submit');

    await waitFor(() => {
      // Simulate video upload
      const videoInput = screen.getByLabelText('Upload Video');
      fireEvent.change(videoInput, { target: { files: [videoFile] } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Please upload a video')).not.toBeInTheDocument();
    });
  });

  test('handles image upload in edit mode', async () => {
    // Mock the API call to get post details
    getPostById.mockResolvedValue({
      _id: '1',
      userId: '2',
      title: 'test post',
      content: 'testing',
      postDate: '2023-11-08T20:27:16.793+00:00',
      image: '',
      video: '',
    });

    const mockUserId = '1';
    const mockPostId = '123';

    const imageFile = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

    await act(async () => render(
      <MemoryRouter initialEntries={[`/edit_post/${mockPostId}`]}>
        <Routes>
          <Route path="/edit_post/:postid" element={<CreatePostPage curUserId={mockUserId} />} />
        </Routes>
      </MemoryRouter>,
    ));

    const submitButton = screen.getByText('Submit');

    await waitFor(() => {
      // Simulate video upload
      const imageInput = screen.getByLabelText('Upload Image');
      fireEvent.change(imageInput, { target: { files: [imageFile] } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Please upload an image')).not.toBeInTheDocument();
    });
  });
});
