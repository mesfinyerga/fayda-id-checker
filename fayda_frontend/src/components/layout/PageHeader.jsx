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
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        mb: 4,
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        animation: 'fadeInScale 0.5s ease-out',
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
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                mb: subtitle ? 1 : 0
              }}
            >
              {title}
            </Typography>
          )}
          
          {subtitle && (
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-text-muted)',
                maxWidth: '600px',
                lineHeight: 1.6,
                fontSize: '1.05rem'
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
