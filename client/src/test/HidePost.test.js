/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  screen, act, render, fireEvent, waitFor,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import HidePost from '../components/HidePost';
import { updateHidePostByUserId } from '../api/user';

jest.mock('../api/user', () => ({
  updateHidePostByUserId: jest.fn(),
}));

describe('hide/show button', () => {
  test('hide button rendered and is functional', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <HidePost
            curUserId="1"
            postUserId="2"
            setChangeHidden={jest.fn()}
            changeHidden={false}
            setPage={jest.fn()}
            page={1}
            hiddens={[]}
            isHidden={false}
            postId="1"
            setHiddens={jest.fn()}
          />
        </BrowserRouter>,
      );
    });

    const button = screen.getByText('Hide');

    expect(button).toBeInTheDocument();

    await act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(updateHidePostByUserId).toHaveBeenCalledWith('1', ['1']);
    });
  });

  test('show button rendered and is functional', async () => {
    await act(() => {
      render(
        <BrowserRouter>
          <HidePost
            curUserId="1"
            postUserId="2"
            setChangeHidden={jest.fn()}
            changeHidden={false}
            setPage={jest.fn()}
            page={1}
            hiddens={['1']}
            isHidden
            postId="1"
            setHiddens={jest.fn()}
          />
        </BrowserRouter>,
      );
    });

    const button = screen.getByText('Show');

    expect(button).toBeInTheDocument();

    await act(() => {
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(updateHidePostByUserId).toHaveBeenCalledWith('1', []);
    });
  });
});
