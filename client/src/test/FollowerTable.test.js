import React from 'react';
import {
  render, screen, act,
} from '@testing-library/react';
import {
  MemoryRouter, Route, Routes,
} from 'react-router-dom';
import FollowerTable from '../components/FollowerTable';

describe('Follower Table Component', () => {
  it('render the follower table component', async () => {
    const followers = ['follower1', 'follower2'];
    await act(async () => render(
      // eslint-disable-next-line react/jsx-filename-extension
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={(
              <FollowerTable
                followers={followers}
              />
              )}
          />
        </Routes>
      </MemoryRouter>,
    ));

    expect(screen.getByText('2 Followers:')).toBeInTheDocument();
    expect(screen.getByText('follower1')).toBeInTheDocument();
    expect(screen.getByText('follower2')).toBeInTheDocument();
  });
});
