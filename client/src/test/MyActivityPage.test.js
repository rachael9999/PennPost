/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  screen, act, render, fireEvent, waitFor,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import MyActivityPage from '../page/MyActivityPage';
import { getAllPostsByUserPerPage, getPostNumByUser } from '../api/posts';

jest.mock('../api/posts', () => ({
  getAllPostsByUserPerPage: jest.fn(),
  getPostNumByUser: jest.fn(),
}));

const mockApiResult = {
  data: {
    data: [
      {
        _id: '1',
        userId: '1',
        title: 'test post 1',
        content: 'test post 1',
        postDate: '2023-10-10T09:15:27+00:00',
        image: '',
        video: '',
      },
      {
        _id: '2',
        userId: '1',
        title: 'test post 2',
        content: 'test post 2',
        postDate: '2023-10-11T09:15:27+00:00',
        image: '',
        video: '',
      },
      {
        _id: '3',
        userId: '1',
        title: 'test post 3',
        content: 'test post 3',
        postDate: '2023-10-10T09:15:27+00:00',
        image: '',
        video: '',
      },
      {
        _id: '4',
        userId: '1',
        title: 'test post 4',
        content: 'test post 4',
        postDate: '2023-10-11T09:15:27+00:00',
        image: '',
        video: '',
      },
    ],
  },
};

const renderPage = async () => {
  await act(() => {
    render(
      <MemoryRouter initialEntries={['/myActivity/1']}>
        <Routes>
          <Route path="/myActivity/:userid" element={<MyActivityPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });
};

describe('MyActvityPage test', () => {
  test('user have no post rendered', async () => {
    getAllPostsByUserPerPage.mockResolvedValue({
      data: {
        data: [],
      },
    });
    getPostNumByUser.mockResolvedValue(0);

    await renderPage();

    expect(screen.getByText('My Posts')).toBeInTheDocument();
    expect(screen.getByText('You Have No Post')).toBeInTheDocument();
  });

  test('user has posts rendered', async () => {
    getAllPostsByUserPerPage.mockResolvedValue(mockApiResult);
    getPostNumByUser.mockResolvedValue(4);

    await renderPage();

    expect(screen.getByText('My Posts')).toBeInTheDocument();
    expect(screen.getAllByText('test post 1')[0]).toBeInTheDocument();
    expect(screen.getAllByText('test post 2')[0]).toBeInTheDocument();
    expect(screen.getAllByText('test post 3')[0]).toBeInTheDocument();
    expect(screen.queryByText('test post 4')).toBeNull();

    expect(screen.getByTestId('page: 1')).toBeInTheDocument();
    expect(screen.getByTestId('page: 2')).toBeInTheDocument();
  });

  test('change page', async () => {
    getAllPostsByUserPerPage.mockResolvedValue(mockApiResult);
    getPostNumByUser.mockResolvedValue(4);

    await renderPage();

    const nextPage = screen.getByRole('button', { name: 'Next' });

    await act(() => {
      fireEvent.click(nextPage);
    });

    await waitFor(() => {
      expect(getAllPostsByUserPerPage).toHaveBeenCalledWith('1', 2);
      expect(getPostNumByUser).toHaveBeenCalledWith('1');
    });

    const prevButton = screen.getByRole('button', { name: 'Previous' });

    await act(() => {
      fireEvent.click(prevButton);
    });

    await waitFor(() => {
      expect(getAllPostsByUserPerPage).toHaveBeenCalledWith('1', 1);
      expect(getPostNumByUser).toHaveBeenCalledWith('1');
    });

    const lastPage = screen.getByRole('button', { name: 'Last' });

    await act(() => {
      fireEvent.click(lastPage);
    });

    await waitFor(() => {
      expect(getAllPostsByUserPerPage).toHaveBeenCalledWith('1', 1);
      expect(getPostNumByUser).toHaveBeenCalledWith('1');
    });
  });

  test('error handling', async () => {
    getAllPostsByUserPerPage.mockRejectedValue(new Error('error'));
    getPostNumByUser.mockResolvedValue(0);

    await renderPage();

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('30 posts rendered', async () => {
    getAllPostsByUserPerPage.mockResolvedValue(mockApiResult);
    getPostNumByUser.mockResolvedValue(30);

    await renderPage();

    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '4' })).toBeNull();

    const lastPage = screen.getByRole('button', { name: 'Last' });

    await act(() => {
      fireEvent.click(lastPage);
    });

    expect(screen.getByTestId('page: 10')).toBeInTheDocument();
    expect(screen.getByTestId('page: 9')).toBeInTheDocument();
    expect(screen.getByTestId('page: 8')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '7' })).toBeNull();
  });
});
