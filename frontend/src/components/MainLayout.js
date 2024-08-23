// src/MainLayout.js
import React, { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Container, Box } from '@mui/material';

import NavBar from './NavBar';
import HeroSection from './HeroSection';
import LinkInputSection from './LinkInputSection';
import LinksTable from './LinksTable';
import Footer from './Footer';
import ShortenedLink from '../components/ShortenedLink';
import theme from '../theme';
import { AuthContext } from '../context/AuthContext';

function MainLayout() {
  const { authToken } = useContext(AuthContext);
  const [shortLink, setShortLink] = useState(false);
  const [shortUrl, setShortUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [last5Links, setLast5Links] = useState([]);

  const handleShortenUrl = async (longUrl) => {
  setIsLoading(true);  // Indicate that the loading has started

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/data/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : '', // Include auth token if available
      },
      body: JSON.stringify({ longUrl }),
      mode: 'cors',  // Ensure CORS mode is set
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setShortUrl(data.shortUrl);
  } catch (error) {
    console.error('PROBLEM with the fetch:', error);
  } finally {
    setIsLoading(false);  // Indicate that the loading has finished
  }
};


  const fetchLast5Links = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/data/last5`, {
        headers: {
          'Authorization': authToken ? `Bearer ${authToken}` : '', // Include auth token if available
        },
      });
      const data = await response.json();
      setLast5Links(data);
    } catch (error) {
      console.error('Error fetching the last 5 links:', error);
    } finally {
      console.log("last5 API SUCCESS")
    }
  };

  const deleteApiCall = async (shortLinkId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/data/delete/${shortLinkId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authToken ? `Bearer ${authToken}` : '', // Include auth token if available
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the link');
      }

      // Refetch the last 5 links after deletion
      fetchLast5Links();
    } catch (error) {
      console.error('PROBLEM with the deleteApiCall:', error);
    } finally {
      console.log('api/v1/data/delete SUCCESS');
    }
  };

  // eslint-disable-next-line
  useEffect(() => {
    if (!authToken) {
      setLast5Links([]);
    } else {
      // eslint-disable-next-line
      fetchLast5Links();
    }
    // eslint-disable-next-line
  }, [shortUrl, authToken]); // Refetch when shortUrl or authToken changes

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="md">
        <HeroSection />
        <LinkInputSection shortLink={shortLink} setShortLink={setShortLink} onShortenUrl={handleShortenUrl} />
        {isLoading && (
          <Box display="flex" justifyContent="center" my={1} mb={10}>
            <CircularProgress />
          </Box>
        )}
        {!isLoading && shortUrl && <ShortenedLink shortUrl={shortUrl} />}
        <LinksTable links={last5Links} deleteApiCall={deleteApiCall} />
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default MainLayout;