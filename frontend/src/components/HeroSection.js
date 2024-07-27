// src/components/HeroSection.js
import React from 'react';
import { Box, Typography } from '@mui/material';

function HeroSection() {
  return (
    <Box 
      textAlign="center" 
      my={4}
    >
      <Typography 
        variant="h2" 
        component="h1" 
        color="primary"
      >
        Shorten looooooonggg links!
      </Typography>
      <Typography 
        variant="h6" 
        component="p" 
        // color="textSecondary"
      >
        minimaLINK is an efficient and easy-to-use URL shortening service.
      </Typography>
    </Box>
  );
}

export default HeroSection;