import React from 'react';
import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      mt={5}
      py={3}
      textAlign="center"
      bgcolor="primary.main"
      color="text.primary"
    >
      <Typography variant="body1">
        © 2024 minimaLINK. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
