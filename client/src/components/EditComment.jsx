import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
import { updateComment, getCommentsByPostId } from '../api/comments';

export default function EditComment(props) {
  const {
    postId,
    commentId,
    content,
    openEditComment,
    setAllComments,
    setNumOfComment,
    setOpenEditComment,
  } = props;
  const [curContent, setCurContent] = useState('');
  const status = ['Null', 'Fail'];
  const [fail, setFail] = useState(status[0]);

  async function updateCommentWrapper() {
    const commentObject = {
      id: commentId,
      content: curContent,
    };
    const response = await updateComment(commentObject);
    return response;
  }

  const handleClose = () => {
    setOpenEditComment(false);
  };

  const handleOnContent = (e) => {
    setCurContent(e.target.value);
    setFail(status[0]);
  };

  const handleEditComment = () => {
    if (curContent === '') {
      setFail(status[1]);
    } else {
      try {
        updateCommentWrapper().then(async () => {
          const response = await getCommentsByPostId(postId);
          return response;
        }).then((response) => {
          setAllComments(response);
          setNumOfComment(response.length);
        }).then(() => {
          setOpenEditComment(false);
        });
      } catch (err) {
        setFail(status[1]);
      }
    }
  };

  return (
    <div className="edit-comment" data-testid="edit-comment">
      <Dialog
        open={openEditComment}
        onClose={handleClose}
        sx={{ '& .MuiDialog-paper': { width: '80%', height: '30%' } }}
      >
        <DialogTitle>Edit Comment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your updated comment below, and comment cannot be empty.
          </DialogContentText>
          <textarea
            placeholder={content}
            onChange={handleOnContent}
            style={{ width: '100%', height: '80%' }}
          />
          {fail === status[1]
            && (
            <DialogContentText>
              <p style={{ color: 'red' }}>Fail to update comment, plase try again!</p>
            </DialogContentText>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditComment} data-testid="edit-comment-btn">Edit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

EditComment.propTypes = {
  postId: PropTypes.string.isRequired,
  commentId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  setAllComments: PropTypes.func.isRequired,
  setNumOfComment: PropTypes.func.isRequired,
  setOpenEditComment: PropTypes.func.isRequired,
  openEditComment: PropTypes.bool.isRequired,
};
