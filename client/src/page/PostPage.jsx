import React, { useEffect, useState } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getPostById } from '../api/posts';
import { getProfileById } from '../api/user';
import ActivityFeedRow from '../components/ActivityFeedRow';
import Comments from '../components/Comments';
import '../style/PostPageStyle.css';

export default function PostPage(props) {
  const { curUserId } = props;
  const { postId } = useParams();
  const [postObject, setPostObject] = useState();
  const [follows, setFollows] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // get post by id
    try {
      getPostById(postId).then((res) => {
        setPostObject(res);
      }).then(() => {
        if (curUserId !== '') {
          getProfileById(curUserId).then((res) => {
            if (res && res !== '' && Array.isArray(res.follows)) {
              setFollows(res.follows);
            }
          });
        }
      }).then(() => {
        setHasLoaded(true);
        setHasError(false);
      });
    } catch (err) {
      setHasError(true);
    }
  }, [hasLoaded]);

  return (
    <div className="post-page" data-testid="post-page">
      <div>
        <br />
        <div>
          <h3 className="post-page-back-to"><NavLink to="/activity">Back to Feed Page</NavLink></h3>
        </div>
      </div>
      {postObject && !hasError
        && (
        <div className="container">
          <div className="row">
            <ActivityFeedRow
              // eslint-disable-next-line no-underscore-dangle
              key={postObject._id}
              // eslint-disable-next-line no-underscore-dangle
              postId={postObject._id}
              userId={postObject.userId}
              title={postObject.title}
              content={postObject.content}
              postDate={postObject.postDate}
              image={postObject.image ? postObject.image : ''}
              video={postObject.video ? postObject.video : ''}
              curUserId={curUserId}
              follows={follows}
              setFollows={setFollows}
              showActions={false}
            />
          </div>
          <div className="row">
            <Comments postId={postId} curUserId={curUserId} />
          </div>
        </div>
        )}
    </div>
  );
}

PostPage.propTypes = {
  curUserId: PropTypes.string.isRequired,
};
