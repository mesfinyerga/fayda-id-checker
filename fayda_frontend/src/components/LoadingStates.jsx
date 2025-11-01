import React from 'react';
import {
  Box,
  Skeleton,
  CircularProgress,
  LinearProgress,
  Typography,
  Paper,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Grid,
  Container,
  Button
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  CloudDownload as DownloadIcon 
} from '@mui/icons-material';

// Basic Loading Spinner
export const LoadingSpinner = ({ 
  size = 40, 
  color = 'primary', 
  message = 'Loading...',
  showMessage = true 
}) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    py: 3
  }}>
    <CircularProgress size={size} color={color} />
    {showMessage && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mt: 2 }}
      >
        {message}
      </Typography>
    )}
  </Box>
);

// Full Page Loading
export const FullPageLoading = ({ message = 'Loading application...' }) => (
  <Box sx={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'background.default',
    zIndex: 9999
  }}>
    <CircularProgress size={60} />
    <Typography 
      variant="h6" 
      color="text.secondary" 
      sx={{ mt: 3 }}
    >
      {message}
    </Typography>
  </Box>
);

// Linear Progress Bar
export const LoadingProgress = ({ 
  progress, 
  message = 'Loading...',
  showPercentage = true 
}) => (
  <Box sx={{ width: '100%', py: 2 }}>
    {message && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {message}
      </Typography>
    )}
    <LinearProgress 
      variant={progress ? "determinate" : "indeterminate"} 
      value={progress} 
    />
    {showPercentage && progress && (
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        {Math.round(progress)}%
      </Typography>
    )}
  </Box>
);

// Card Skeleton
export const CardSkeleton = ({ 
  variant = 'rectangular', 
  height = 200,
  showAvatar = false,
  showActions = false 
}) => (
  <Card sx={{ width: '100%' }}>
    <CardContent>
      {showAvatar && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        </Box>
      )}
      <Skeleton variant={variant} height={height} />
      {showActions && (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rectangular" width={80} height={32} />
          <Skeleton variant="rectangular" width={80} height={32} />
        </Box>
      )}
    </CardContent>
  </Card>
);

// Table Skeleton
export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true 
}) => (
  <TableContainer component={Paper}>
    <Table>
      {showHeader && (
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width="80%" />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      )}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton variant="text" width="90%" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// List Skeleton
export const ListSkeleton = ({ 
  items = 5, 
  showAvatar = true,
  showSecondary = true 
}) => (
  <List>
    {Array.from({ length: items }).map((_, index) => (
      <ListItem key={index}>
        {showAvatar && (
          <ListItemAvatar>
            <Skeleton variant="circular" width={40} height={40} />
          </ListItemAvatar>
        )}
        <ListItemText
          primary={<Skeleton variant="text" width="60%" />}
          secondary={showSecondary ? <Skeleton variant="text" width="40%" /> : null}
        />
      </ListItem>
    ))}
  </List>
);

// Form Skeleton
export const FormSkeleton = ({ 
  fields = 4, 
  showSubmit = true 
}) => (
  <Box sx={{ width: '100%' }}>
    {Array.from({ length: fields }).map((_, index) => (
      <Box key={index} sx={{ mb: 3 }}>
        <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" height={56} />
      </Box>
    ))}
    {showSubmit && (
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="rectangular" width={120} height={40} />
      </Box>
    )}
  </Box>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
  <Container maxWidth="lg" sx={{ py: 3 }}>
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" />
        </Box>
      </Grid>

      {/* Stats Cards */}
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="50%" />
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="30%" />
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Main Content */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </Grid>

      {/* Sidebar */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width="40%" sx={{ mb: 2 }} />
            <ListSkeleton items={3} showAvatar={false} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Container>
);

// Content Skeleton
export const ContentSkeleton = ({ 
  type = 'default',
  lines = 3,
  showImage = false 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'text':
        return (
          <Box>
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton 
                key={index} 
                variant="text" 
                width={index === lines - 1 ? "60%" : "100%"} 
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        );
      
      case 'card':
        return <CardSkeleton />;
      
      case 'table':
        return <TableSkeleton />;
      
      case 'list':
        return <ListSkeleton />;
      
      case 'form':
        return <FormSkeleton />;
      
      default:
        return (
          <Box>
            {showImage && (
              <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
            )}
            {Array.from({ length: lines }).map((_, index) => (
              <Skeleton 
                key={index} 
                variant="text" 
                width={index === lines - 1 ? "60%" : "100%"} 
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        );
    }
  };

  return renderSkeleton();
};

// Loading State with Retry
export const LoadingWithRetry = ({ 
  loading, 
  error, 
  onRetry, 
  children,
  loadingMessage = 'Loading...',
  errorMessage = 'Something went wrong'
}) => {
  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 4
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {error.message || 'Please try again'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  return children;
};

// Loading Overlay
export const LoadingOverlay = ({ 
  loading, 
  children, 
  message = 'Loading...',
  opacity = 0.7 
}) => (
  <Box sx={{ position: 'relative' }}>
    {children}
    {loading && (
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        zIndex: 1000
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <CircularProgress size={40} />
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 1 }}
          >
            {message}
          </Typography>
        </Box>
      </Box>
    )}
  </Box>
);

// Export all components
export default {
  LoadingSpinner,
  FullPageLoading,
  LoadingProgress,
  CardSkeleton,
  TableSkeleton,
  ListSkeleton,
  FormSkeleton,
  DashboardSkeleton,
  ContentSkeleton,
  LoadingWithRetry,
  LoadingOverlay
};
