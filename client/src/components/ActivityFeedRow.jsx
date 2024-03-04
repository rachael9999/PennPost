import React, { useEffect, useState } from 'react';
import { Button, Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/ActivityFeedRowStyle.css';
import { FaHeart, FaComment } from 'react-icons/fa';

import HidePost from './HidePost';
import { getProfileById, updateFollowById } from '../api/user';
import {
  addLike, removeLike, checkUserLiked, getLikeCount,
} from '../api/like';

function ActivityFeedRow(props) {
  const [hasFollow, setHasFollow] = useState(false);
  const [name, setName] = useState('');
  const {
    postId, userId, title, content, postDate, image,
    video, curUserId, follows, setFollows, showActions,
    hiddens, isHidden, setPage, page,
    setChangeHidden, changeHidden,
  } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const postDateObj = new Date(postDate);
  const postDateString = postDateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const [profileImg, setProfileImg] = useState('');

  async function updateFollowByIdWrapper(updateFollow) {
    try {
      const response = await updateFollowById(curUserId, updateFollow);
      return response;
    } catch (err) {
      return -1;
    }
  }

  useEffect(() => {
    // get post by id
    try {
      getProfileById(userId).then((res) => {
        if (res) {
          const temp = `${res.firstName} ${res.lastName}`;
          setName(temp);
          setProfileImg(res.photo);
        }
      });
    } catch (err) {
      setName('');
    }
    if (follows.includes(userId)) {
      setHasFollow(true);
    } else {
      setHasFollow(false);
    }

    const checkLike = async () => {
      try {
        const liked = await checkUserLiked(postId, curUserId);
        setIsLiked(liked);
        const count = await getLikeCount(postId);
        setLikeCount(count.data);
      } catch (error) {
        // console.log('error checking like: ', error);
      }
    };

    checkLike();
  }, [follows, postId, curUserId]);

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

  const handleLikeClick = async () => {
    try {
      if (isLiked) {
        await removeLike(postId, curUserId);
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await addLike(postId, curUserId);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
    } catch (error) {
      // console.error('Error updating like:', error);
    }
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

  return (
    <div className="activity-feed-row" data-testid="activity-feed-row">
      <div className="container-fluid activity-feed-row-container">
        <div className="row">
          <div className="col">
            <div className="activity-feed-row-user">
              <Avatar alt={name} src={profileImg} />
              <p>{name}</p>
              <div>
                {followBtn()}
                <HidePost
                  curUserId={curUserId}
                  postUserId={userId}
                  setChangeHidden={setChangeHidden}
                  changeHidden={changeHidden}
                  setPage={setPage}
                  page={page}
                  hiddens={hiddens}
                  isHidden={isHidden}
                  postId={postId}
                />
              </div>
            </div>
          </div>
          <div className="col-10">
            <h3 className="activity-feed-row-title">
              <NavLink
                to={`/post/${postId}`}
                style={{ color: 'black', textDecoration: 'none' }}
                className="comment-button-link"
              >
                {title}
              </NavLink>
            </h3>
          </div>
          <div className="col">
            <p className="activity-feed-row-data">
              Created date:
              {' '}
              {postDateString}
            </p>
          </div>
        </div>
        <div className="row">
          <br />
        </div>
        <div className="row">
          <pre className="content-text">{content}</pre>
        </div>
        {image
          && (
          <div className="row activity-feed-row-img-box">
            <img className="activity-feed-row-img" src={image} alt="This is an post view." />
          </div>
          )}
        {video
          && (
          <div className="row">
            <video width="320" height="240" controls>
              <source src={video} type="video/mp4" />
              <source src={video} type="video/webm" />
              <source src={video} type="video/ogg" />
              <track kind="captions" />
            </video>
          </div>
          )}
        {showActions && (
          <div className="row">
            <div className="col-6 action-buttons">
              <button type="button" className="like-button" onClick={handleLikeClick}>
                <FaHeart color={isLiked ? 'red' : 'white'} stroke="red" strokeWidth="1rem" />
                {likeCount}
              </button>
            </div>
            <div className="col-6 action-buttons">
              <NavLink
                to={`/post/${postId}`}
                style={{ color: 'black', textDecoration: 'none' }}
                className="comment-button-link"
              >
                <FaComment color="white" stroke="black" strokeWidth="1rem" />
                {' '}
                Comment
              </NavLink>
            </div>
          </div>
        )}
      </div>

      {/* <Modal show={Error} onHide={() => setError(false)}>
        <Modal.Body>
          Something Went Wrong
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={setError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}

ActivityFeedRow.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  postDate: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  video: PropTypes.string.isRequired,
  curUserId: PropTypes.string.isRequired,
  follows: PropTypes.arrayOf(PropTypes.string).isRequired,
  hiddens: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFollows: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  changeHidden: PropTypes.bool.isRequired,
  page: PropTypes.number.isRequired,
  isHidden: PropTypes.bool.isRequired,
  showActions: PropTypes.bool.isRequired,
  setChangeHidden: PropTypes.func.isRequired,
};

export default ActivityFeedRow;
