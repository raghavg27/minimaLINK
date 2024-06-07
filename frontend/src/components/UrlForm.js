import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent } from '@mui/material';

function UrlForm({ onShortenUrl }) {
  const [longUrl, setLongUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onShortenUrl(longUrl);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mt={5} display="flex" justifyContent="center">
      <Card sx={{ width: '100%', maxWidth: 600, backgroundColor: '#1e1e1e', boxShadow: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Enter long URL"
            variant="outlined"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            sx={{ mb: 3, fontSize: '1.25rem', backgroundColor: '#333' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Shorten URL
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UrlForm;
