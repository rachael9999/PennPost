/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import ActivityFeedRow from '../components/ActivityFeedRow';
import { getPostsByPage, getPostById } from '../api/posts';
import { getProfileById } from '../api/user';
import '../style/ActivityFeedPageStyle.css';
import FollowTable from '../components/FollowTable';

export default function ActivityFeedPage(props) {
  const { curUserId } = props;
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [follows, setFollows] = useState([]);
  const [onButton, setOnButton] = useState('all posts');
  const [changeHidden, setChangeHidden] = useState(false);

  const loadedPosts = useRef([]);
  const prePageStart = useRef();
  const hiddenPostsId = useRef([]);
  const HiddenPostsList = useRef([]);

  async function getPostsByPageWrapper() {
    // get posts by page
    try {
      const response = await getPostsByPage(page, curUserId);
      return response.data.data;
    } catch (err) {
      setHasMorePages(false);
      return -1;
    }
  }

  async function loadingPosts() {
    getPostsByPageWrapper().then((res) => {
      if (Array.isArray(res) && res.length > 0 && res[0]._id !== prePageStart.current) {
        setAllPosts([...loadedPosts.current, ...res]);
        loadedPosts.current = [...loadedPosts.current, ...res];
        prePageStart.current = res[0]._id;
      } else if (res && res.length === 0) {
        setHasMorePages(false);
      }
    }).catch(() => {
      setHasMorePages(false);
    });
  }

  async function loadingHiddenPostsAndFollows() {
    try {
      const user = await getProfileById(curUserId);
      if (user && user !== '') {
        setFollows(user.follows);
        hiddenPostsId.current = user.hiddenPosts;

        const promiseArr = hiddenPostsId.current.map(async (postid) => {
          const post = await getPostById(postid);
          return post;
        });
        Promise.all(promiseArr).then((res) => {
          HiddenPostsList.current = res;
        });
      }
    } catch (err) {
      HiddenPostsList.current = [];
      setFollows([]);
    }
  }

  // load next page posts
  useEffect(() => {
    // run the wrapper function
    loadingPosts();
    // loadingHiddenPosts();

    const intervalId = setInterval(() => {
      setPage(1);
      setAllPosts([]);
      loadedPosts.current = [];
      prePageStart.current = null;
      setHasMorePages(true);
    }, 20000);

    // console.log(allPosts);
    if (curUserId !== '') {
      loadingHiddenPostsAndFollows();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [page, loadedPosts.current, changeHidden, onButton]);

  const showHiddenPosts = () => {
    if (HiddenPostsList.current.length !== 0) {
      return HiddenPostsList.current.map((post) => (
        <ActivityFeedRow
          // eslint-disable-next-line no-underscore-dangle
          key={post._id}
          postId={post._id}
          userId={post.userId}
          title={post.title}
          content={post.content}
          postDate={post.postDate}
          image={post.image ? post.image : ''}
          video={post.video ? post.video : ''}
          curUserId={curUserId}
          follows={follows}
          page={page}
          hiddens={hiddenPostsId.current}
          setChangeHidden={setChangeHidden}
          changeHidden={changeHidden}
          setFollows={setFollows}
          setPage={setPage}
          isHidden
          showActions
        />
      ));
    }
    return null;
  };

  const showPosts = () => allPosts.map((post) => {
    if (onButton === 'following posts') {
      if ((follows.includes(post.userId) || post.userId === curUserId)
        && (!hiddenPostsId.current.includes(post._id))) {
        return (
          <ActivityFeedRow
            // eslint-disable-next-line no-underscore-dangle
            key={post._id}
            postId={post._id}
            userId={post.userId}
            title={post.title}
            content={post.content}
            postDate={post.postDate}
            image={post.image ? post.image : ''}
            video={post.video ? post.video : ''}
            curUserId={curUserId}
            follows={follows}
            page={page}
            hiddens={hiddenPostsId.current}
            setFollows={setFollows}
            setChangeHidden={setChangeHidden}
            changeHidden={changeHidden}
            setPage={setPage}
            isHidden={false}
            showActions
          />
        );
      }
    } else {
      if (!hiddenPostsId.current.includes(post._id)) {
        return (
          <ActivityFeedRow
            // eslint-disable-next-line no-underscore-dangle
            key={post._id}
            // eslint-disable-next-line no-underscore-dangle
            postId={post._id}
            userId={post.userId}
            title={post.title}
            content={post.content}
            postDate={post.postDate}
            image={post.image ? post.image : ''}
            video={post.video ? post.video : ''}
            curUserId={curUserId}
            follows={follows}
            page={page}
            hiddens={hiddenPostsId.current}
            setChangeHidden={setChangeHidden}
            changeHidden={changeHidden}
            setFollows={setFollows}
            setPage={setPage}
            isHidden={(onButton === 'hidden posts')}
            showActions
          />
        );
      }
      return null;
    }
    return null;
  });

  const handleNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  return (
    <div className="activity-feed" data-testid="activity-feed">
      <div className="container">
        <div className="row">
          <div className="col-9">
            {onButton !== 'hidden posts' ? (
              <InfiniteScroll
                dataLength={allPosts.length}
                next={handleNext}
                hasMore={hasMorePages}
                loader={<div>loading</div>}
                endMessage={<p>Hit end!</p>}
              >
                {showPosts()}
              </InfiniteScroll>
            ) : (
              showHiddenPosts()
            )}

            <div className="post-filter">
              <Button
                variant="contained"
                onClick={() => setOnButton('all posts')}
                style={{ backgroundColor: (onButton === 'all posts') ? 'rgba(163, 184, 255, 0.479)' : 'grey' }}
              >
                All Posts
              </Button>
              <Button
                variant="contained"
                onClick={() => setOnButton('following posts')}
                style={{ backgroundColor: (onButton === 'following posts') ? 'rgba(163, 184, 255, 0.479)' : 'grey' }}
              >
                Following Posts
              </Button>
              <Button
                variant="contained"
                onClick={() => setOnButton('hidden posts')}
                style={{ backgroundColor: (onButton === 'hidden posts') ? 'rgba(163, 184, 255, 0.479)' : 'grey' }}
              >
                Hidden Posts
              </Button>
            </div>

          </div>
          <div className="col">
            <div className="create-post-btn" data-testid="create-post-btn">
              <Button
                disabled={curUserId === ''}
                variant="contained"
                component={Link}
                to="/create_post"
              >
                Create Post
              </Button>
              <FollowTable follows={follows} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ActivityFeedPage.propTypes = {
  curUserId: PropTypes.string.isRequired,
};
