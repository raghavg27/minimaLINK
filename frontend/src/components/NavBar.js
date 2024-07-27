// src/components/NavBar.js
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Link, Avatar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

import logo from '../assets/logo.png';
import unknownPerson from '../assets/broken-image.jpg';

function NavBar() {
  const { authToken, username, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar 
      position="static" 
      style={{ background: 'transparent', boxShadow: 'none' }}
    >
      <Toolbar>
        <Link
          href="/"
          underline="none"
          component="a"
          sx={{ display: 'block' }}
        >
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', width: '40px', marginRight: 10 }} 
          />
        </Link>
        <Typography 
          variant="h6" 
          color="primary"
          style={{ flexGrow: 1 }}
        >
          minimaLINK
        </Typography>
        {authToken ? (
          <>
            <Avatar
              sx={{ bgcolor: 'primary', marginLeft: '8px', marginRight: '10px' }}
            >
              {username ? username.charAt(0).toUpperCase() : 'HI'}
            </Avatar>
            <Button 
              variant="contained"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Avatar
              alt="Unknown Person"
              src={unknownPerson} // Placeholder image URL
              style={{ marginLeft: '8px', marginRight: '10px' }}
            />
            <Button 
              variant="contained"
              component={RouterLink} 
              to="/signin"
            >
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;