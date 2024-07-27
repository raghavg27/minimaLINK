import React, { useState, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Tooltip,
  Typography
} from '@mui/material';
import { Delete, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LinksTable({ links, deleteApiCall }) {
  const { authToken } = useContext(AuthContext);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  const handleButtonClick = (id) => {
    setSelectedLinkId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (selectedLinkId) {
      await deleteApiCall(selectedLinkId);
      setOpen(false);
      setSelectedLinkId(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLinkId(null);
  };

  return (
    <>
      {authToken ? (
        <TableContainer component={Paper} style={{ height: 370, width: '100%', overflowX: 'auto', marginTop: 20 }}>
          <Table style={{ minWidth: 200, fontSize: '0.875rem' }}>
            <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#111111', zIndex: 1 }}>
              <TableRow>
                <TableCell>Short Link</TableCell>
                <TableCell>Original Link</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                    <CopyToClipboard text={row.shortLink} onCopy={() => setCopied(true)}>
                      <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                        <IconButton color="primary" onMouseLeave={() => setCopied(false)} size="small">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CopyToClipboard>
                    {row.shortLinkId}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {row.originalLink}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>{row.clicks}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>{row.dateCreated}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>
                    <IconButton color="secondary" size="small" onClick={() => handleButtonClick(row.shortLinkId)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} style={{ height: 200, width: '100%', overflowX: 'auto', marginTop: 20 }}>
          <Table style={{ minWidth: 200, fontSize: '0.875rem' }}>
            <TableHead style={{ position: 'sticky', top: 0, backgroundColor: '#111111', zIndex: 1 }}>
              <TableRow>
                <TableCell>Short Link</TableCell>
                <TableCell>Original Link</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {links.map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>
                    <CopyToClipboard text={row.shortLink} onCopy={() => setCopied(true)}>
                      <Tooltip title={copied ? "Copied!" : "Copy Link"}>
                        <IconButton color="primary" onMouseLeave={() => setCopied(false)} size="small">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CopyToClipboard>
                    {row.shortLinkId}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                    {row.originalLink}
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>{row.clicks}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>{row.dateCreated}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap' }}>
                    <IconButton color="secondary" size="small" onClick={() => handleButtonClick(row.shortLinkId)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete Link"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this link?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LinksTable;