/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  screen, act, render, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import PostCard from '../components/MyPostCard';
import { deletePostByPostId } from '../api/posts';

jest.mock('../api/posts', () => ({
  deletePostByPostId: jest.fn(),
}));

describe('Test MyPostCard', () => {
  beforeEach(async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <PostCard
            postId="1"
            title="test title"
            content="test content"
            postDate="2023-11-04T03:08:49.899+00:00"
            image="imageLink"
            video="videoLink"
            setSuccessModalShow={jest.fn()}
            curUserId="1"
          />
        </BrowserRouter>,
      );
    });
  });

  test('Content is rendered', async () => {
    const postDateObj = new Date('2023-11-04T03:08:49.899+00:00');
    const postDateString = postDateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    expect(screen.getByText('test title')).toBeInTheDocument();
    expect(screen.getByText(postDateString)).toBeInTheDocument();
    expect(screen.getByAltText('img here')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  test('redirect when click on edit', async () => {
    const editButton = screen.getByText('Edit');

    await act(() => {
      fireEvent.click(editButton);
    });

    expect(window.location.pathname).toBe('/edit_post/1');
  });

  test('modal appears when click on delete', async () => {
    const deleteButton = screen.getByText('Delete');

    await act(() => {
      fireEvent.click(deleteButton);
    });

    expect(screen.getByText('Are you sure you want to delete this post?')).toBeInTheDocument();
    expect(screen.getByText('No, Close')).toBeInTheDocument();
    expect(screen.getByText('Yes, Delete')).toBeInTheDocument();
  });

  test('handle delete work properly', async () => {
    const deleteButton = screen.getByText('Delete');

    await act(() => {
      fireEvent.click(deleteButton);
    });

    const yesButton = screen.getByText('Yes, Delete');

    await act(() => {
      fireEvent.click(yesButton);
    });

    await waitFor(() => {
      expect(deletePostByPostId).toHaveBeenCalledWith('1');
    });
  });

  test('close modal button work properly', async () => {
    const deleteButton = screen.getByText('Delete');

    await act(() => {
      fireEvent.click(deleteButton);
    });

    const noButton = screen.getByText('No, Close');

    await act(() => {
      fireEvent.click(noButton);
    });

    expect(screen.queryByText('Are you sure you want to delete this post?')).toBeNull();
    expect(screen.getByText('test content')).toBeInTheDocument();
  });
});
