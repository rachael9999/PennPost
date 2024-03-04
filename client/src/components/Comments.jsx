import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/CommentsStyle.css';
import PropTypes from 'prop-types';
import { getCommentsByPostId } from '../api/comments';
import CommentRow from './CommentRow';
import PostComment from './PostComment';

export default function Comments(props) {
  const { postId, curUserId } = props;
  const [allComments, setAllComments] = useState([]);
  const [numOfComments, setNumOfComment] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPage, setTotalPage] = useState(1);
  const [openPostComment, setOpenPostComment] = useState(false);

  async function getCommentsByPostIdWrapper() {
    // get posts by page
    const response = await getCommentsByPostId(postId);
    return response;
  }

  async function loadingComments() {
    getCommentsByPostIdWrapper().then((res) => {
      setAllComments(res);
      setNumOfComment(res.length);
    }).then(() => {
      const pages = Math.ceil(numOfComments / pageSize);
      setTotalPage(pages === 0 ? 1 : pages);
    });
  }

  useEffect(() => {
    loadingComments();
    const intervalId = setInterval(() => {
      loadingComments();
    }, 10000);
    return () => {
      clearInterval(intervalId);
    };
  }, [numOfComments, pageSize]);

  const commentRows = () => allComments.map((comment, idx) => (
    (idx < page * pageSize && idx >= (page - 1) * pageSize)
      ? (
        <CommentRow
          // eslint-disable-next-line no-underscore-dangle
          key={comment._id}
          // eslint-disable-next-line no-underscore-dangle
          commentId={comment._id}
          content={comment.content}
          postDate={comment.postDate}
          userId={comment.userId}
          numOfComments={numOfComments}
          setNumOfComment={setNumOfComment}
          curUserId={curUserId}
          postId={postId}
          setAllComments={setAllComments}
        />
      ) : null));

  const handleChangePage = (e) => {
    const nextPage = parseInt(e.target.textContent, 10);
    if (nextPage !== page) {
      setPage(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page + 1 <= totalPage) {
      setPage(page + 1);
    }
  };

  const handleChangePageSize = (e) => {
    const newPageSize = e.target.value;
    if (newPageSize > 0) {
      setPageSize(newPageSize);
      setPage(1);
    }
  };

  const handlePostComment = () => {
    setOpenPostComment(true);
  };

  const getPagination = () => {
    const pageNumbers = [];
    const pageRange = 3;
    for (let i = page - pageRange; i <= page + pageRange; i += 1) {
      if (i >= 1 && i <= totalPage) {
        pageNumbers[i] = i;
      }
    }
    return (
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <Button type="button" onClick={handlePreviousPage}>Previous</Button>
        </li>
        {pageNumbers.map((pageNum) => {
          if (page === pageNum) {
            return (
              <li key={pageNum} className="page-item">
                <Button type="button" variant="contained" onClick={handleChangePage}>
                  {pageNum}
                </Button>
              </li>
            );
          }
          return (
            <li key={pageNum} className="page-item">
              <Button type="button" onClick={handleChangePage}>
                {pageNum}
              </Button>
            </li>
          );
        })}
        <li className="page-item">
          <Button type="button" onClick={handleNextPage}>
            Next
          </Button>
        </li>
      </ul>
    );
  };

  return (
    <div className="comments" data-testid="comments">
      <div className="add-comment-box">
        <h2>Comments: </h2>
        <Button type="button" variant="contained" onClick={handlePostComment}>
          Post Comment
        </Button>
      </div>
      <br />
      <PostComment
        openPostComment={openPostComment}
        postId={postId}
        curUserId={curUserId}
        setAllComments={setAllComments}
        setOpenPostComment={setOpenPostComment}
        setNumOfComment={setNumOfComment}
      />
      <div className="comment-rows">
        {commentRows()}
      </div>
      <nav aria-label="Page navigation">
        {getPagination()}
      </nav>
      <label className="page-size">
        Comment Page Size:
        <input
          data-testid="page-size-input"
          type="number"
          id="page-size"
          name="page size"
          min="1"
          max="20"
          defaultValue={pageSize}
          onClick={handleChangePageSize}
          onChange={handleChangePageSize}
        />
      </label>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
  curUserId: PropTypes.string.isRequired,
};
