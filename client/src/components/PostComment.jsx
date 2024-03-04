import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
import { createNewComment, getCommentsByPostId } from '../api/comments';

export default function PostComment(props) {
  const {
    openPostComment,
    postId,
    curUserId,
    setAllComments,
    setOpenPostComment,
    setNumOfComment,
  } = props;
  const [content, setContent] = useState('');
  const status = ['Null', 'Fail'];
  const [fail, setFail] = useState(status[0]);

  async function postCommentWrapper() {
    const postDate = new Date(Date.now()).toISOString();
    const commentObject = {
      postId,
      userId: curUserId,
      content,
      postDate,
    };
    const response = await createNewComment(commentObject);
    return response;
  }

  const handleClose = () => {
    setOpenPostComment(false);
  };

  const handleOnContent = (e) => {
    setContent(e.target.value);
    setFail(status[0]);
  };

  const handlePostComment = () => {
    if (content === '') {
      setFail(status[1]);
    } else {
      try {
        postCommentWrapper().then(async () => {
          const response = await getCommentsByPostId(postId);
          return response;
        }).then((response) => {
          setAllComments(response);
          setNumOfComment(response.length);
          setContent('');
        }).then(() => {
          setOpenPostComment(false);
        });
      } catch (err) {
        setFail(status[1]);
      }
    }
  };

  return (
    <div className="post-comment" data-testid="post-comment">
      <Dialog
        open={openPostComment}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { width: '80%', height: '30%' } }}
      >
        <DialogTitle>Post Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your comment below, and comment cannot be empty.
          </DialogContentText>
          <textarea
            placeholder="Your comment"
            onChange={handleOnContent}
            style={{ width: '100%', height: '80%' }}
          />
          {fail === status[1]
            && (
            <DialogContentText style={{ color: 'red' }}>
              Fail to post comment, plase try again!
            </DialogContentText>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handlePostComment}>Post</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

PostComment.propTypes = {
  openPostComment: PropTypes.bool.isRequired,
  postId: PropTypes.string.isRequired,
  curUserId: PropTypes.string.isRequired,
  setAllComments: PropTypes.func.isRequired,
  setOpenPostComment: PropTypes.func.isRequired,
  setNumOfComment: PropTypes.func.isRequired,
};
