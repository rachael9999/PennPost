import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';
import { Avatar, Button } from '@mui/material';
import '../style/CommentRowStyle.css';
import { getProfileById } from '../api/user';
import { deleteCommentById } from '../api/comments';
import EditComment from './EditComment';

export default function CommentRow(props) {
  const {
    commentId,
    content,
    userId,
    postDate,
    numOfComments,
    setNumOfComment,
    curUserId,
    postId,
    setAllComments,
  } = props;
  const [name, setName] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [openEditComment, setOpenEditComment] = useState(false);
  const postDateObj = new Date(postDate);
  const postDateString = postDateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    // run the wrapper function
    if (name === '') {
      getProfileById(userId).then((res) => {
        if (res) {
          const temp = `${res.firstName} ${res.lastName}`;
          setName(temp);
          setProfileImg(res.photo);
        }
      });
    }
  }, [name]);

  const handleOnDelete = () => {
    try {
      deleteCommentById(commentId).then(() => {
        setNumOfComment(numOfComments - 1);
      });
      return 1;
    } catch {
      return -1;
    }
  };

  const handleOnEdit = () => {
    setOpenEditComment(true);
  };

  return (
    <div className="comment-row">
      <EditComment
        postId={postId}
        commentId={commentId}
        content={content}
        openEditComment={openEditComment}
        setAllComments={setAllComments}
        setNumOfComment={setNumOfComment}
        setOpenEditComment={setOpenEditComment}
      />
      <div className="container-fluid comment-row-container">
        <div className="row">
          <div className="col">
            <div className="row">
              <div className="comment-row-user">
                <Avatar alt={name} src={profileImg} />
                <p>{name}</p>
              </div>
            </div>
          </div>
          <div className="col-10">
            <div className="row">
              <pre className="comment-content">{content}</pre>
            </div>
            <div className="row">
              <div className="btn-box">
                <div className="btn-box">
                  {curUserId === userId && (
                    <Button type="button" size="small" onClick={handleOnDelete}>
                      Delete
                    </Button>
                  )}
                  {curUserId === userId && (
                    <Button type="button" size="small" onClick={handleOnEdit}>
                      Edit
                    </Button>
                  )}
                </div>
                <p className="comment-row-date">
                  Created Date:
                  {' '}
                  {postDateString}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

CommentRow.propTypes = {
  commentId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  postDate: PropTypes.string.isRequired,
  numOfComments: PropTypes.number.isRequired,
  setNumOfComment: PropTypes.func.isRequired,
  curUserId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
  setAllComments: PropTypes.func.isRequired,
};
