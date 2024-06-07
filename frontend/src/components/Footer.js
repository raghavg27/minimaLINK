import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

function Footer() {
  return (
    
      <Toolbar>
        <Box width="100%" display="flex" justifyContent="center" mt={5} py={3} textAlign="center" bgcolor="primary.main" color="text.primary">
          <Typography variant="body1">
        © 2024 minimaLINK. All rights reserved.
      </Typography>
        </Box>
      </Toolbar>
    
  );
}

export default Footer;
