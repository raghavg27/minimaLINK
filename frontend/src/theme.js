import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontSize: '2.5rem', // Increased h4 size
    },
    h6: {
      fontSize: '1.25rem', // Increased h6 size
    },
    body1: {
      fontSize: '1.125rem', // Increased body1 size
    },
  },
  spacing: 8, // Default spacing is already 8px, adjust if needed
});

export default theme;
