import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import PostComment from '../components/PostComment';
import { createNewComment, getCommentsByPostId } from '../api/comments';

// Mocking API
jest.mock('../api/comments', () => ({
  createNewComment: jest.fn(),
  getCommentsByPostId: jest.fn(),
}));

describe('Post Comment', () => {
  it('render the post comment component', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    createNewComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      {
        _id: '1',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment1',
        postDate: '2020-04-02T04:00:00.000Z',
      },
      {
        _id: '2',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment2',
        postDate: '2020-04-01T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <PostComment
                openPostComment
                postId={mockPostId}
                curUserId={mockUserId}
                setAllComments={jest.fn()}
                setOpenPostComment={jest.fn()}
                setNumOfComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('post-comment')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
  });

  test('post a comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    createNewComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      {
        _id: '1',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment1',
        postDate: '2020-04-02T04:00:00.000Z',
      },
      {
        _id: '2',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment2',
        postDate: '2020-04-01T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <PostComment
                openPostComment
                postId={mockPostId}
                curUserId={mockUserId}
                setAllComments={jest.fn()}
                setOpenPostComment={jest.fn()}
                setNumOfComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    expect(screen.getByTestId('post-comment')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
    const contentText = screen.getByPlaceholderText('Your comment');
    act(() => {
      fireEvent.change(contentText, { target: { value: 'comment3' } });
    });
    const postCommentBtn = screen.getByText('Post');
    act(() => {
      fireEvent.click(postCommentBtn);
    });
  });

  test('try post an empty comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    createNewComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      {
        _id: '1',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment1',
        postDate: '2020-04-02T04:00:00.000Z',
      },
      {
        _id: '2',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment2',
        postDate: '2020-04-01T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <PostComment
                openPostComment
                postId={mockPostId}
                curUserId={mockUserId}
                setAllComments={jest.fn()}
                setOpenPostComment={jest.fn()}
                setNumOfComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    expect(screen.getByTestId('post-comment')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
    const postCommentBtn = screen.getByText('Post');
    act(() => {
      fireEvent.click(postCommentBtn);
    });
  });

  test('cancel post comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    createNewComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      {
        _id: '1',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment1',
        postDate: '2020-04-02T04:00:00.000Z',
      },
      {
        _id: '2',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment2',
        postDate: '2020-04-01T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <PostComment
                openPostComment
                postId={mockPostId}
                curUserId={mockUserId}
                setAllComments={jest.fn()}
                setOpenPostComment={jest.fn()}
                setNumOfComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    expect(screen.getByTestId('post-comment')).toBeInTheDocument();
    expect(screen.getByText('Post Comment')).toBeInTheDocument();
    const cancelBtn = screen.getByText('Cancel');
    act(() => {
      fireEvent.click(cancelBtn);
    });
  });
});
