import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

function Footer() {
  return (
    
      <Toolbar>
        <Box width="100%" display="flex" justifyContent="center" mt={5} py={3} textAlign="center" bgcolor="primary.main" color="text.primary">
          <Typography variant="body1">
            <a href="https://github.com/raghavg27/minimaLINK" target="_blank" > Project repository </a> <br />
            NOTE: Backend server will spin down with inactivity, which can delay requests by 50 seconds or more. <br /> 
              Please refresh page and wait till instance wakes up :(
          </Typography>
        </Box>
      </Toolbar>
    
  );
}

export default Footer;
