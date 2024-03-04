import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, Button, ButtonGroup, Modal,
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import '../style/myPostCardStyle.css';
import { deletePostByPostId } from '../api/posts';

function Postcard(props) {
  const [warningModalShow, setWarningModalShow] = useState(false);
  const navigate = useNavigate();

  const {
    postId, title, content, postDate, image, video,
    setSuccessModalShow, curUserId,
  } = props;

  const postDateObj = new Date(postDate);
  const postDateString = postDateObj.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleDelete = async () => {
    await deletePostByPostId(postId);
    setSuccessModalShow(true);
    setWarningModalShow(false);
  };

  const handleEdit = () => {
    navigate(`/edit_post/${postId}`, { curUserId });
  };

  return (
    <>
      <Card className="bg-secondary text-white">
        <Card.Header className="bg-white text-black text-center">
          <h5><NavLink to={`/post/${postId}`}>{`${title}`}</NavLink></h5>
          <h6 className="text-muted">{`${postDateString}`}</h6>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            {`${content}`}
          </Card.Text>
          <div className="row">
            <div className="col justify-content-center">
              {image && (
                <img src={image} alt="img here" />
              )}
            </div>
            <div className="col justify-content-center">
              {video && (
                <video width="200" height="150" controls>
                  <source src={video} type="video/mp4" />
                  <source src={video} type="video/webm" />
                  <source src={video} type="video/ogg" />
                  <track kind="captions" />
                </video>
              )}
            </div>
          </div>
        </Card.Body>
        <Card.Footer>
          <div className="row justify-content-center">
            <ButtonGroup className="sm" style={{ width: '50%' }}>
              <Button variant="primary" type="button" onClick={handleEdit}>Edit</Button>
              <Button variant="danger" type="button" size="sm" onClick={() => setWarningModalShow(true)}>Delete</Button>
            </ButtonGroup>
          </div>
        </Card.Footer>
      </Card>

      <Modal show={warningModalShow} onHide={() => setWarningModalShow(false)}>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setWarningModalShow(false)}>
            No, Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Postcard.propTypes = {
  postId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  postDate: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  video: PropTypes.string.isRequired,
  setSuccessModalShow: PropTypes.func.isRequired,
  curUserId: PropTypes.string.isRequired,
};

export default Postcard;
