import React, { useState } from 'react';
import { Box, TextField, Button, Card, CardContent } from '@mui/material';

function UrlForm({ onShortenUrl }) {
  const [longUrl, setLongUrl] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onShortenUrl(longUrl);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} disabled={isLoading} mt={5} display="flex" justifyContent="center">
      <Card sx={{ width: '100%', backgroundColor: '#1e1e1e', boxShadow: 3, flexDirection: 'column', justifyContent: 'center'}}>
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
