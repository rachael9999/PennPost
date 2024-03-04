import React from 'react';
import {
  render, screen, act, waitFor,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import FollowTable from '../components/FollowTable';
import { getProfileById } from '../api/user';

jest.mock('../api/user', () => ({
  getProfileById: jest.fn(),
}));

describe('Follow Table Component', () => {
  it('render the follow table component', async () => {
    getProfileById.mockResolvedValue({});
    const follows = ['follower1', 'follower2'];
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={(
              <FollowTable
                follows={follows}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    await waitFor(() => expect(screen.getByText('2 Following Users:')).toBeInTheDocument());
  });
});
