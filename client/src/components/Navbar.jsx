import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Navbar, Container, NavDropdown, Button,
} from 'react-bootstrap';
import { Avatar } from '@mui/material';

import { getProfileById } from '../api/user';

function MyNavbar(props) {
  const pennLogo = 'data:image/png;base64,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';

  const { curUserId, setCurUserId } = props;
  const isLogin = curUserId !== '';
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState('');

  const handleLogOut = () => {
    localStorage.removeItem('curUserId');
    localStorage.removeItem('jwtToken');
    setCurUserId('');
    navigate('/');
  };

  useEffect(() => {
    const getProfilePic = async () => {
      const res = await getProfileById(curUserId);
      if (res !== '') {
        return res;
      }
      return undefined;
    };

    if (curUserId !== '') {
      getProfilePic().then((res) => {
        setProfilePhoto(res?.photo);
      });
    }
  }, [profilePhoto]);

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <NavLink to={(isLogin) ? '/activity' : '/'} className="navbar-brand">
          <img src={pennLogo} alt="pennLogo" style={{ width: 110 }} />
          PennPost
        </NavLink>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          { isLogin ? (
            <NavDropdown
              title={(
                <div className="pull-right">
                  <Avatar src={profilePhoto} alt="profilePict" className="rounded-circle" />
                </div>
              )}
            >
              <NavDropdown.Item as={NavLink} to={`/profile/${curUserId}`}>Profile</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to={`/myActivity/${curUserId}`}>My Activity</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item id="SignoutButton" onClick={handleLogOut}>Log Out</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <NavLink to="/">
              <Button type="button" size="lg" className="pull-right">Log In</Button>
            </NavLink>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

MyNavbar.propTypes = {
  curUserId: PropTypes.string.isRequired,
  setCurUserId: PropTypes.func.isRequired,
};

export default MyNavbar;
