import React, { useState } from 'react';
import { CircularProgress, ThemeProvider, CssBaseline, Container, Typography, Box, Paper } from '@mui/material';
import theme from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import UrlForm from './components/UrlForm';
import UrlResult from './components/UrlResult';

function App() {
  const [shortUrl, setShortUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleShortenUrl = async (longUrl) => {
    setIsLoading(true);  // Indicate that the loading has started

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/data/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error('Error:', error);
    } finally {
    setIsLoading(false);  // Indicate that the loading has finished
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box textAlign="center" mt={10}>
          <Paper elevation={3} sx={{ p: 5, backgroundColor: '#1e1e1e', color: '#fff' }}>
            <Typography variant="h4" gutterBottom>
              Welcome to minimaLINK
            </Typography>
            <Typography variant="body1" gutterBottom>
              Easily shorten your long URLs.<br />
              Enter your long URL below to get started.
            </Typography>
          </Paper>

          <UrlForm onShortenUrl={handleShortenUrl} />
          {isLoading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}
          
          {!isLoading && shortUrl && <UrlResult shortUrl={shortUrl} />}
        </Box>
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
