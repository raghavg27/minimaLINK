import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, IconButton, Snackbar, Alert } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

function UrlResult({ shortUrl }) {
  const [open, setOpen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box mt={5} display="flex" justifyContent="center">
      <Card sx={{ width: '100%', maxWidth: 600, backgroundColor: '#1e1e1e', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', flexDirection: 'column', justifyContent: 'center'}}>
            Shortened URL:
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body1" component="div" sx={{ wordBreak: 'break-all', color: '#90caf9' }}>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#90caf9', textDecoration: 'none' }}>
                {shortUrl}
              </a>
            </Typography>
            <IconButton onClick={copyToClipboard} color="secondary">
              <ContentCopy />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%', flexDirection: 'column', justifyContent: 'center' }}>
          Copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UrlResult;
