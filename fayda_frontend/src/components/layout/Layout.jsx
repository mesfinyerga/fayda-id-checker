import React from 'react';
import { Box, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Layout = ({ 
  children, 
  maxWidth = 'lg', 
  disableGutters = false,
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        ...sx
      }}
      {...props}
    >
      {/* Main Content Area */}
      <Container
        maxWidth={maxWidth}
        disableGutters={disableGutters}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: isMobile ? 2 : 3,
          px: isMobile ? 2 : 3,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
