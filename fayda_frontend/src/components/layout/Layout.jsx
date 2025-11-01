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
        backgroundColor: 'var(--color-bg)',
        animation: 'fadeIn 0.4s ease-out',
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
          py: isMobile ? 3 : 4,
          px: isMobile ? 2 : 4,
        }}
      >
        <Box sx={{ animation: 'slideInUp 0.5s ease-out', width: '100%' }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
