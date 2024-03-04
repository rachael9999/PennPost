import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TextField, Button, FormControl, FormLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  NavLink, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { Form } from 'react-bootstrap';

import { createNewPost, getPostById, updatePost } from '../api/posts';
import '../style/CreatePostPageStyle.css';

export default function CreatePostPage(props) {
  const { pathname } = useLocation();
  const { postid } = useParams();
  const navigate = useNavigate();

  const { curUserId } = props;
  const userId = curUserId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [invalidImage, setInvalidImage] = useState(false);
  const [imageChange, setImageChange] = useState(false);
  const [video, setVideo] = useState('');
  const [invalidVideo, setInvalidVideo] = useState(false);
  const [videoChange, setVideoChange] = useState(false);
  const [created, setCreated] = useState(false);

  const [invalidImageSize, setInvalidImageSize] = useState(false);
  const [invalidVideoSize, setInvalidVideoSize] = useState(false);

  const onEdit = pathname.startsWith('/edit_post');

  useEffect(() => {
    if (onEdit) {
      getPostById(postid).then((res) => {
        setTitle(res.title);
        setContent(res.content);
        setImage(res.image);
        setVideo(res.video);
      });
    }
  }, [created]);

  async function createPostsWrapper() {
    const postDate = new Date(Date.now()).toISOString();

    const data = new FormData();
    data.append('userId', userId);
    data.append('title', title);
    data.append('content', content);
    data.append('postDate', postDate);
    if (imageChange) data.append('image', image);
    if (videoChange) data.append('video', video);

    const response = await createNewPost(data);
    return response;
  }

  const handleOnImage = (e) => {
    const file = e.target.files[0];
    const maxSize = 50 * 1024 * 1024; // 50 MB in bytes
    if (!file.type.startsWith('image')) {
      setInvalidImage(true);
    } else if (file.size > maxSize) {
      setInvalidImageSize(true);
      setInvalidImage(false);
    } else {
      setImage(file);
      setImageChange(true);
      setInvalidImageSize(false);
    }
  };

  const handleOnVideo = (e) => {
    const file = e.target.files[0];
    const maxSize = 500 * 1024 * 1024; // 500 MB in bytes
    if (!file.type.startsWith('video')) {
      setInvalidVideo(true);
    } else if (file.size > maxSize) {
      setInvalidVideoSize(true);
      setInvalidVideo(false);
    } else {
      setVideo(file);
      setVideoChange(true);
      setInvalidVideoSize(false);
    }
  };

  const handleOnSubmit = () => {
    if (!invalidImage && !invalidVideo && !invalidImageSize && !invalidVideoSize) {
      try {
        if (onEdit) {
          const postDate = new Date(Date.now()).toISOString();
          const newPost = new FormData();
          newPost.append('title', title);
          newPost.append('content', content);
          if (imageChange) newPost.append('image', image);
          if (videoChange) newPost.append('video', video);
          newPost.append('postDate', postDate);

          updatePost(postid, newPost).then(() => {
            navigate(`/myActivity/${userId}`);
          });
        } else {
          createPostsWrapper().then(() => {
            setCreated(true);
          });
        }
      } catch (err) {
        setCreated(false);
      }
    }
  };

  return (
    <div className="create-post-page" data-testid="create-post-page">
      {created
        && (
        <div>
          <h2>Successfully created a post!</h2>
          <NavLink to="/activity">Back to Feed Page</NavLink>
        </div>
        )}
      {!created
        && (
        <FormControl className="create-post-form">
          <FormLabel>Title</FormLabel>
          <TextField type="text" placeholder={onEdit ? `${title}` : 'title'} className="input-field" onChange={(e) => setTitle(e.target.value)} />

          <FormLabel>Content</FormLabel>
          <textarea className="create-post-form-content" placeholder={onEdit ? `${content}` : 'content'} onChange={(e) => setContent(e.target.value)} />

          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" size="lg" onChange={handleOnImage} />
            {invalidImage && (<p style={{ color: 'red' }}>Please upload an image</p>)}
          </Form.Group>

          <Form.Group controlId="formFileLg" className="mb-3">
            <Form.Label>Upload Video</Form.Label>
            <Form.Control type="file" size="lg" onChange={handleOnVideo} />
            {invalidVideo && (<p style={{ color: 'red' }}>Please upload an video</p>)}
          </Form.Group>

          {invalidImageSize && (<p style={{ color: 'red' }}>Image size should be less than 50 MB</p>)}
          {invalidVideoSize && (<p style={{ color: 'red' }}>Video size should be less than 500 MB</p>)}

          <Button onClick={handleOnSubmit}>Submit</Button>
        </FormControl>
        )}
    </div>
  );
}

CreatePostPage.propTypes = {
  curUserId: PropTypes.string.isRequired,
};
