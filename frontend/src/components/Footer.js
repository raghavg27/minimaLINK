import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

function Footer() {
  return (
    <AppBar position="static" sx={{ boxShadow: 3, backgroundColor: '#333' }}>
      <Toolbar>
        <Box width="100%" display="flex" justifyContent="center" mt={5} py={3} textAlign="center" bgcolor="primary.main" color="text.primary">
          <Typography variant="body1">
        © 2024 minimaLINK. All rights reserved.
      </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
