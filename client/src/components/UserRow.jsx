import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ActivityFeedRowStyle.css';
import { updateFollowById } from '../api/user';

export default function UserRow(props) {
  const {
    curUserId, userId, name, follows, setFollows,
  } = props;
  const [hasFollow, setHasFollow] = useState(false);

  async function updateFollowByIdWrapper(updateFollow) {
    try {
      const response = await updateFollowById(curUserId, updateFollow);
      return response;
    } catch (err) {
      return -1;
    }
  }

  const hanldeOnFollow = () => {
    if (!follows.includes(userId)) {
      const updateFollow = [...follows, userId];
      updateFollowByIdWrapper(updateFollow).then(() => {
        setFollows(updateFollow);
        setHasFollow(true);
      });
    }
  };

  const hanldeOnUnfollow = () => {
    const updateFollow = follows.reduce((cum, cur) => {
      if (cur === userId) {
        return cum;
      }
      cum.push(cur);
      return cum;
    }, []);
    updateFollowByIdWrapper(updateFollow).then(() => {
      setFollows(updateFollow);
      setHasFollow(false);
    });
  };

  const followBtn = () => {
    if (curUserId !== userId) {
      if (!hasFollow) {
        return (
          <Button
            className="follow-btn"
            size="small"
            variant="outline"
            disabled={curUserId === ''}
            onClick={hanldeOnFollow}
          >
            Follow
          </Button>
        );
      }
      return (
        <Button
          className="follow-btn"
          size="small"
          variant="outline"
          disabled={curUserId === ''}
          onClick={hanldeOnUnfollow}
        >
          Unfollow
        </Button>
      );
    }
    return (<Button className="follow-btn" size="small" variant="outline" disabled>Me</Button>);
  };

  // check is the user is already followed or not
  useEffect(() => {
    if (follows.includes(userId)) {
      setHasFollow(true);
    } else {
      setHasFollow(false);
    }
  }, [follows]);

  return (
    <div className="user-row">
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            ID:
            {userId}
          </div>
          <div className="col">
            {name}
          </div>
          <div className="col">
            {followBtn()}
          </div>
        </div>
      </div>
    </div>
  );
}

UserRow.propTypes = {
  curUserId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  follows: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFollows: PropTypes.func.isRequired,
};
