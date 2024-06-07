import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

function Header() {
  return (
    <AppBar position="static" sx={{ boxShadow: 3, backgroundColor: '#333' }}>
      <Toolbar>
        <Box width="100%" display="flex" justifyContent="center">
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            minimaLINK
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
