// src/components/Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      textAlign="center"
      mt={10}
      py={4}
      px={2}
      sx={{
        bgcolor: 'primary.main',
        
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        MINIMALINK is a URL shortening service that makes your links manageable.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <Link href="https://github.com/raghavg27/minimaLINK" target="_blank" color="inherit">
          GitHub Repository
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer;