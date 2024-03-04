import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter, Routes, Route, Link, useLocation,
} from 'react-router-dom';
import {
  RiHome2Line, RiHome2Fill, RiUser2Line, RiUser2Fill, RiMessage2Line, RiMessage2Fill,
  RiBallPenLine, RiBallPenFill, RiContactsBookLine, RiContactsBookFill,
} from 'react-icons/ri';
import ProtectedRoute from './protectRoute';

import Navbar from './components/Navbar';
import ActivityFeedPage from './page/ActivityFeedPage';
import PostPage from './page/PostPage';
import CreatePostPage from './page/CreatePostPage';
import ProfilePage from './page/ProfilePage';
import LogIn from './page/LogIn';
import SignUp from './page/SignUp';
import UsersPage from './page/UsersPage';
import MyActivityPage from './page/MyActivityPage';

function App() {
  const [curUserId, setCurUserId] = useState(
    localStorage.getItem('curUserId') || '',
  );

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar curUserId={curUserId} setCurUserId={setCurUserId} />
        <Routes>
          <Route path="/" element={<LogIn setCurUserId={setCurUserId} />} />
          <Route path="/sign_up" element={<SignUp setCurUserId={setCurUserId} />} />
          <Route
            path="/*"
            element={(
              <ProtectedRoute>
                <MainContent curUserId={curUserId} setCurUserId={setCurUserId} />
              </ProtectedRoute>
          )}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function MainContent({ curUserId }) {
  const { pathname } = useLocation();

  return (
    <div className="main-container">
      {
        pathname !== '/' && pathname !== '/sign_up' ? (
          <div className="sidebar">
            <div className="buttons">
              <Link to="/activity" type="button" className="sidebar-btn" data-testid="feed-link">
                <RiHome2Line className="sidebar-icon outline-icon" />
                <RiHome2Fill className="sidebar-icon fill-icon" />
                <span className="text">Feed</span>
              </Link>

              <Link to={`/myActivity/${curUserId}`} type="button" className="sidebar-btn">
                <RiMessage2Line className="sidebar-icon outline-icon" />
                <RiMessage2Fill className="sidebar-icon fill-icon" />
                <span className="text">My Activity</span>
              </Link>

              <Link to="/create_post" type="button" className="sidebar-btn">
                <RiBallPenLine className="sidebar-icon outline-icon" />
                <RiBallPenFill className="sidebar-icon fill-icon" />
                <span className="text" style={{ textDecoration: 'none' }}>Create Post</span>
              </Link>

              <Link to={`/profile/${curUserId}`} type="button" className="sidebar-btn">
                <RiUser2Line className="sidebar-icon outline-icon" />
                <RiUser2Fill className="sidebar-icon fill-icon" />
                <span className="text">Profile</span>
              </Link>

              <Link to="/users" type="button" className="sidebar-btn">
                <RiContactsBookLine className="sidebar-icon outline-icon" />
                <RiContactsBookFill className="sidebar-icon fill-icon" />
                <span className="text">All Users</span>
              </Link>
            </div>

          </div>

        ) : null
      }
      <div className="content">
        <Routes>
          <Route path="/activity" element={<ActivityFeedPage curUserId={curUserId} />} />
          <Route path="/post/:postId/" element={<PostPage curUserId={curUserId} />} />
          <Route path="/create_post" element={<CreatePostPage curUserId={curUserId} />} />
          <Route path="/profile/:userid" element={<ProfilePage />} />
          <Route path="/users" element={<UsersPage curUserId={curUserId} />} />
          <Route path="/myActivity/:userid" element={<MyActivityPage />} />
          <Route path="/edit_post/:postid" element={<CreatePostPage curUserId={curUserId} />} />
        </Routes>
      </div>
    </div>
  );
}

MainContent.propTypes = {
  curUserId: PropTypes.string.isRequired,
};

export default App;
