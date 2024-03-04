import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllUsers, getProfileById } from '../api/user';
import '../style/ActivityFeedPageStyle.css';
import UserRow from '../components/UserRow';

export default function UsersPage(props) {
  const { curUserId } = props;
  const [follows, setFollows] = useState([]);
  const [users, setUsers] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  // load users
  useEffect(() => {
    if (curUserId !== '') {
      try {
        getAllUsers().then((res) => {
          if (res && Array.isArray(res)) {
            setUsers(res);
          }
        }).then(() => {
          getProfileById(curUserId).then((res) => {
            if (res && res !== '' && Array.isArray(res.follows)) {
              setFollows(res.follows);
            }
          });
        }).then(() => {
          setHasLoaded(true);
        });
      } catch (err) {
        setUsers([]);
      }
    }

    const intervalId = setInterval(() => {
      setHasLoaded(!hasLoaded);
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [hasLoaded]);

  const showUsers = () => (
    users.map((user) => (
      // eslint-disable-next-line no-underscore-dangle
      <div key={user._id}>
        <UserRow
          curUserId={curUserId}
          // eslint-disable-next-line no-underscore-dangle
          userId={user._id}
          name={`${user.firstName} ${user.lastName}`}
          follows={follows}
          setFollows={setFollows}
        />
        <br />
      </div>
    ))
  );

  return (
    <div className="users-page" data-testid="users-page">
      <h2>Users: </h2>
      <div className="container">
        {showUsers()}
      </div>
    </div>
  );
}

UsersPage.propTypes = {
  curUserId: PropTypes.string.isRequired,
};
