// src/components/LinkInputSection.js
import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Slide, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AuthContext } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinkInputSection({ shortLink, setShortLink, onShortenUrl }) {
  const { authToken } = useContext(AuthContext);
  const [link, setLink] = useState('');
  const [autoPaste, setAutoPaste] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInputChange = (event) => {
    setLink(event.target.value);
  };

  const handleButtonClick = () => {
    if (!authToken) {
      setOpen(true);
    } else {
      setShortLink(link);
      onShortenUrl(link);
    }
  };

  const handleSwitchChange = async (event) => {
    setAutoPaste(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const pasteFromClipboard = async () => {
      if (autoPaste) {
        try {
          const clipboardText = await navigator.clipboard.readText();
          setLink(clipboardText);
        } catch (error) {
          console.error('Failed to read clipboard contents: ', error);
        }
      }
    };

    pasteFromClipboard();
  }, [autoPaste]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '60px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '600px', marginBottom: '30px' }}>
          <CustomTextField
            variant="outlined"
            placeholder="Enter the link here"
            fullWidth
            value={link}
            onChange={handleInputChange}
            style={{ marginRight: '8px' }}
          />
          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            Shorten!
          </Button>
        </div>
        <FormControlLabel
          control={<Switch color="primary" checked={autoPaste} onChange={handleSwitchChange} />}
          label="Auto Paste from Clipboard"
        />
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Login Required!"}</DialogTitle>
        <DialogContent>
          <Typography>Login to start using the service </Typography>
          <br/>
          <Typography variant="caption">This platform is hosted on a complimentary instance. The backend server may enter a dormant state due to inactivity, potentially causing delays for your requests.. :(</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleClose} 
            color="secondary" 
            component={RouterLink} 
            to="/signin">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LinkInputSection;