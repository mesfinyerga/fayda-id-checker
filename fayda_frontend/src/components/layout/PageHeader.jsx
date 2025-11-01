import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Breadcrumb from '../Breadcrumb';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        py: isMobile ? 3 : 4,
        px: isMobile ? 2 : 3,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'neutral.200',
        mb: 3,
        ...sx
      }}
      {...props}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb 
          items={breadcrumbs}
          sx={{ mb: 2 }}
        />
      )}

      {/* Header Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        {/* Title and Subtitle */}
        <Box sx={{ flex: 1 }}>
          {title && (
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              gutterBottom={!!subtitle}
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                lineHeight: 1.5
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        {actions && (
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={1}
            sx={{
              flexShrink: 0,
              width: isMobile ? '100%' : 'auto'
            }}
          >
            {Array.isArray(actions) ? actions : [actions]}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default PageHeader;
