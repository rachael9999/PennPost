import React from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import EditComment from '../components/EditComment';
import { updateComment, getCommentsByPostId } from '../api/comments';

// Mocking API
jest.mock('../api/comments', () => ({
  updateComment: jest.fn(),
  getCommentsByPostId: jest.fn(),
}));

describe('Update Comment Component', () => {
  it('render the update comment component', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    const comment1 = {
      _id: '1',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment1',
      postDate: '2020-04-02T04:00:00.000Z',
    };
    const comment2 = {
      _id: '2',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment2',
      postDate: '2020-04-01T04:00:00.000Z',
    };
    updateComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      comment1, comment2,
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <EditComment
                postId={mockPostId}
                // eslint-disable-next-line no-underscore-dangle
                commentId={comment1._id}
                content={comment1.content}
                openEditComment
                setAllComments={jest.fn()}
                setNumOfComment={jest.fn()}
                setOpenEditComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByTestId('edit-comment')).toBeInTheDocument();
    expect(screen.getByText('Edit Comment')).toBeInTheDocument();
    expect(screen.getByText('Please enter your updated comment below, and comment cannot be empty.')).toBeInTheDocument();
  });

  test('update a comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    const comment1 = {
      _id: '1',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment1',
      postDate: '2020-04-02T04:00:00.000Z',
    };
    const comment2 = {
      _id: '2',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment2',
      postDate: '2020-04-01T04:00:00.000Z',
    };
    updateComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      comment1, comment2,
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <EditComment
                postId={mockPostId}
                // eslint-disable-next-line no-underscore-dangle
                commentId={comment1._id}
                content={comment1.content}
                openEditComment
                setAllComments={jest.fn()}
                setNumOfComment={jest.fn()}
                setOpenEditComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    const contentText = screen.getByPlaceholderText('comment1');
    act(() => {
      fireEvent.change(contentText, { target: { value: 'comment1 edit' } });
    });
    const editCommentBtn = screen.getByText('Edit');
    act(() => {
      fireEvent.click(editCommentBtn);
    });
  });

  test('try input an empty comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    const comment1 = {
      _id: '1',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment1',
      postDate: '2020-04-02T04:00:00.000Z',
    };
    const comment2 = {
      _id: '2',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment2',
      postDate: '2020-04-01T04:00:00.000Z',
    };
    updateComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      comment1, comment2,
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <EditComment
                postId={mockPostId}
                // eslint-disable-next-line no-underscore-dangle
                commentId={comment1._id}
                content={comment1.content}
                openEditComment
                setAllComments={jest.fn()}
                setNumOfComment={jest.fn()}
                setOpenEditComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    const editCommentBtn = screen.getByTestId('edit-comment-btn');
    act(() => {
      fireEvent.click(editCommentBtn);
    });
  });

  test('cancel edit comment', async () => {
    const mockPostId = '65442a834067eed946a655ae';
    const mockUserId = '6541905e1eba1ff7195a26c9';
    const comment1 = {
      _id: '1',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment1',
      postDate: '2020-04-02T04:00:00.000Z',
    };
    const comment2 = {
      _id: '2',
      postId: mockPostId,
      userId: mockUserId,
      content: 'comment2',
      postDate: '2020-04-01T04:00:00.000Z',
    };
    updateComment.mockResolvedValue();
    getCommentsByPostId.mockResolvedValue([
      comment1, comment2,
    ]);
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={[`/post/${mockPostId}`]}>
        <Routes>
          <Route
            path={`/post/${mockPostId}`}
            element={(
              <EditComment
                postId={mockPostId}
                // eslint-disable-next-line no-underscore-dangle
                commentId={comment1._id}
                content={comment1.content}
                openEditComment
                setAllComments={jest.fn()}
                setNumOfComment={jest.fn()}
                setOpenEditComment={jest.fn()}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));
    const cancelBtn = screen.getByText('Cancel');
    act(() => {
      fireEvent.click(cancelBtn);
    });
  });
});
