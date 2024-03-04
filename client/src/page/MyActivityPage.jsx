/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Pagination, Modal, Button,
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import MyPostCard from '../components/MyPostCard';
import { getAllPostsByUserPerPage, getPostNumByUser } from '../api/posts';

function MyActivityPage() {
  const { userid } = useParams();

  const [page, setPage] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [postCardList, setPostCardList] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [successModalShow, setSuccessModalShow] = useState(false);

  const lastPage = useRef(1);

  async function getPosts() {
    try {
      const response = await getAllPostsByUserPerPage(userid, page);

      const cardList = [];
      response.data.data.forEach((el) => cardList.push(
        <div className="col" style={{ width: '100%' }}>
          <MyPostCard
            postId={el._id}
            title={el.title}
            content={el.content}
            postDate={el.postDate}
            image={el.image ? el.image : ''}
            video={el.video ? el.video : ''}
            setSuccessModalShow={setSuccessModalShow}
            curUserId={userid}
          />
        </div>,
      ));

      return cardList;
    } catch (err) {
      setHasError(true);
      return [];
    }
  }

  async function renderPageButton() {
    try {
      const num = await getPostNumByUser(userid);
      let pageList = [];
      lastPage.current = Math.ceil(num / 3);

      const lower = Math.max(1, page - 2);
      const higher = Math.min(lastPage.current, page + 2);

      for (let i = lower; i <= higher; i += 1) {
        pageList.push((
          <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)} data-testid={`page: ${i}`}>
            {i}
          </Pagination.Item>
        ));
      }

      if (page - 2 > 1) {
        pageList = [<Pagination.Ellipsis />, ...pageList];
      }
      if (page + 2 < lastPage.current) {
        pageList = [...pageList, <Pagination.Ellipsis />];
      }

      return pageList;
    } catch {
      setHasError(true);
      return [];
    }
  }

  useEffect(() => {
    getPosts().then((posts) => {
      setPostCardList(posts);
      renderPageButton().then((buttons) => setPagination(buttons));
    });
  }, [page]);

  const handleClose = () => {
    setSuccessModalShow(false);
    window.location.reload();
  };

  return (
    <Container>
      <div className="row text-center">
        <h2>My Posts</h2>
      </div>

      {(postCardList.length !== 0 && !hasError) ? (
        <>
          <div className="container">
            <div className="row mt-1 row-cols-1 row-cols-md-2 g-4 justify-content-center">
              {postCardList[0]}
            </div>

            <div className="row mt-2 row-cols-1 row-cols-md-2 g-4">
              {postCardList[1]}
            </div>

            <div className="row mt-2 row-cols-1 row-cols-md-2 g-4">
              {postCardList[2]}
            </div>
          </div>

          <Container>
            <div className="row mt-5 justify-content-center">
              <Pagination className="justify-content-center">
                <Pagination.First onClick={() => setPage(1)} />
                <Pagination.Prev onClick={() => setPage(Math.max(1, page - 1))} />
                {pagination}
                <Pagination.Next onClick={() => setPage(Math.min(lastPage.current, page + 1))} />
                <Pagination.Last onClick={() => setPage(lastPage.current)} />
              </Pagination>
            </div>

          </Container>
        </>
      ) : (
        <div className="d-flex justify-content-center align-items-center square-container" style={{ height: '80vh' }}>
          <h3>
            {hasError ? 'Something went wrong' : 'You Have No Post'}
          </h3>
        </div>
      )}

      <Modal show={successModalShow} onHide={() => setSuccessModalShow(false)}>
        <Modal.Body>
          Post Deleted Successfully
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyActivityPage;
