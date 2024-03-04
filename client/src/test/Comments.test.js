import React from 'react';
import {
  render, screen, fireEvent, act, waitFor,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import Comments from '../components/Comments';
import { getCommentsByPostId } from '../api/comments';
import { getProfileById } from '../api/user';

// Mocking API
jest.mock('../api/comments', () => ({
  getCommentsByPostId: jest.fn(),
}));

jest.mock('../api/user', () => ({
  getProfileById: jest.fn(),
}));

describe('Comments component', () => {
  it('render the post comment component', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
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
    getProfileById.mockResolvedValue({});
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <Comments
                postId={mockPostId}
                curUserId={mockUserId}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    await waitFor(() => {
      expect(screen.getByTestId('comments')).toBeInTheDocument();
      expect(screen.getByText('Comments:')).toBeInTheDocument();
      expect(screen.getByText('Comment Page Size:')).toBeInTheDocument();
      expect(screen.getByText('comment1')).toBeInTheDocument();
      expect(screen.getByText('comment2')).toBeInTheDocument();
    });
  });

  test('click post comment button', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    getProfileById.mockResolvedValue({});
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
              <Comments
                postId={mockPostId}
                curUserId={mockUserId}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    const postCommentBtn = screen.getByText('Post Comment');
    await act(() => {
      fireEvent.click(postCommentBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('Please enter your comment below, and comment cannot be empty.')).toBeInTheDocument();
    });
  });

  test('click comment1 delete button', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    getProfileById.mockResolvedValue({});
    getCommentsByPostId.mockResolvedValue([
      {
        _id: '1',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment1',
        postDate: '2020-04-02T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <Comments
                postId={mockPostId}
                curUserId={mockUserId}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    await waitFor(() => {
      expect(screen.getByText('comment1')).toBeInTheDocument();
    });
    const comment1DeleteBtn = screen.getByText('Delete');
    await act(() => {
      fireEvent.click(comment1DeleteBtn);
    });
  });

  test('check comments pagenation', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    getProfileById.mockResolvedValue({});
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
      {
        _id: '3',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment3',
        postDate: '2020-03-02T04:00:00.000Z',
      },
      {
        _id: '4',
        postId: mockPostId,
        userId: mockUserId,
        content: 'comment4',
        postDate: '2020-03-01T04:00:00.000Z',
      },
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <Comments
                postId={mockPostId}
                curUserId={mockUserId}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    const firstPageBtn = screen.getByText('1');
    const secPageBtn = screen.getByText('2');
    await act(() => {
      fireEvent.click(secPageBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('comment4')).toBeInTheDocument();
    });

    await act(() => {
      fireEvent.click(firstPageBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('comment1')).toBeInTheDocument();
    });

    const prePageBtn = screen.getByText('Previous');
    const nextPageBtn = screen.getByText('Next');
    await act(() => {
      fireEvent.click(nextPageBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('comment4')).toBeInTheDocument();
    });
    await act(() => {
      fireEvent.click(prePageBtn);
    });
    await waitFor(() => {
      expect(screen.getByText('comment1')).toBeInTheDocument();
    });

    const pageSizeInput = screen.getByTestId('page-size-input');
    await act(() => {
      fireEvent.change(pageSizeInput, { target: { value: 10 } });
    });
    await waitFor(() => {
      expect(screen.getByText('comment1')).toBeInTheDocument();
      expect(screen.getByText('comment2')).toBeInTheDocument();
      expect(screen.getByText('comment3')).toBeInTheDocument();
      expect(screen.getByText('comment4')).toBeInTheDocument();
    });
  });
});
