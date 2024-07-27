// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EB568E', // Brand-Primary-Pink
    },
    secondary: {
      main: '#144EE3', // Brand-Primary-Blue
    },
    background: {
      default: '#0B101B', // Black
      paper: '#181E29', // Grey
    },
    text: {
      primary: '#C9CED6', // Lite
      textSecondary: '#C9CED6',
    },
  },
  typography: {
    fontFamily: 'SP Pro Display, Arial',
  },
  spacing: 8, // default spacing unit
});

export default theme;