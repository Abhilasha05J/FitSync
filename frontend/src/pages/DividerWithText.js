import React from 'react';
import { Box, Divider, Typography } from '@mui/material';

const DividerWithText = () => {
  return (
    <Box display="flex" alignItems="center" my={2}>
      <Divider sx={{ flex: 1, bgcolor: 'grey.300' }} />
      <Typography variant="body1" color="textSecondary" sx={{ px: 2 }}>
        OR
      </Typography>
      <Divider sx={{ flex: 1, bgcolor: 'pink' }} />
    </Box>
  );
};

export default DividerWithText;
