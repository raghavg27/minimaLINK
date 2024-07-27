// src/components/ShortenedLink.js

import React, { useState } from 'react';
import { Paper, Typography, IconButton, Tooltip, Link } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShortenedLink = ({shortUrl}) => {
  const [copied, setCopied] = useState(false);
  const shortenedLink = shortUrl // remap

  return (
    <Paper elevation={24} sx={{ display: 'flex', alignItems: 'center', p: 2, my: 8 }}>
      <Typography variant="body1" sx={{ flexGrow: 1 }}>
        <Link href={shortenedLink} target="_blank">
          {shortenedLink}
        </Link>
      </Typography>
      <CopyToClipboard text={shortenedLink} onCopy={() => setCopied(true)}>
        <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
          <IconButton color="primary" onMouseLeave={() => setCopied(false)}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </CopyToClipboard>
    </Paper>
  );
};

export default ShortenedLink;