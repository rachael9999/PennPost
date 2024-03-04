import React from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import { updateHidePostByUserId } from '../api/user';

function HidePost(props) {
  const {
    curUserId, postUserId, page, setPage, hiddens,
    isHidden, postId, setChangeHidden, changeHidden,
  } = props;

  const handleHide = async () => {
    try {
      let updatedHiddenArr;
      if (isHidden) {
        updatedHiddenArr = hiddens.filter((el) => el !== postId);
        await updateHidePostByUserId(curUserId, updatedHiddenArr);
        setChangeHidden(!changeHidden);
      } else {
        updatedHiddenArr = [...hiddens, postId];
        await updateHidePostByUserId(curUserId, updatedHiddenArr);
        setPage(page + 1);
      }
    } catch (err) {
      // console.error('Error updating hide:', err);
    }
  };

  return (
    <Button
      className="hide-btn"
      size="small"
      variant="outlined"
      disabled={curUserId === postUserId}
      onClick={handleHide}
    >
      {isHidden ? 'Show' : 'Hide'}
    </Button>
  );
}

HidePost.propTypes = {
  curUserId: PropTypes.string.isRequired,
  postUserId: PropTypes.string.isRequired,
  setChangeHidden: PropTypes.func.isRequired,
  changeHidden: PropTypes.bool.isRequired,
  setPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  hiddens: PropTypes.arrayOf(PropTypes.string).isRequired,
  isHidden: PropTypes.bool.isRequired,
  postId: PropTypes.string.isRequired,
};

export default HidePost;
