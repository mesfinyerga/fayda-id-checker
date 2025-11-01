import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Container,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon
} from '@mui/icons-material';

import ErrorBoundary, { useErrorHandler } from './ErrorBoundary';
import {
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
} from './LoadingStates';

// Component that throws an error for testing
const ErrorThrower = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('This is a test error for ErrorBoundary!');
  }
  return (
    <Alert severity="success">
      This component is working normally. Click "Throw Error" to test the ErrorBoundary.
    </Alert>
  );
};

// Component that simulates loading states
const LoadingSimulator = ({ type = 'spinner' }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const simulateLoading = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate API call
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const simulateError = async () => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate error after 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error('Simulated API error occurred');
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const renderLoadingState = () => {
    switch (type) {
      case 'spinner':
        return <LoadingSpinner message="Loading data..." />;
      case 'progress':
        return <LoadingProgress progress={progress} message="Processing..." />;
      case 'skeleton':
        return <CardSkeleton />;
      case 'overlay':
        return (
          <LoadingOverlay loading={loading} message="Loading...">
            <Card>
              <CardContent>
                <Typography variant="h6">Content Behind Overlay</Typography>
                <Typography variant="body2">
                  This content is visible when not loading
                </Typography>
              </CardContent>
            </Card>
          </LoadingOverlay>
        );
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {type.charAt(0).toUpperCase() + type.slice(1)} Loading Test
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={simulateLoading}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Simulate Loading
          </Button>
          <Button
            variant="outlined"
            startIcon={<ErrorIcon />}
            onClick={simulateError}
            disabled={loading}
          >
            Simulate Error
          </Button>
        </Box>

        {loading && renderLoadingState()}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message}
          </Alert>
        )}
        {!loading && !error && (
          <Alert severity="info">
            Click a button above to test loading states
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

// Main test component
const ErrorLoadingTest = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const triggerError = () => {
    setShouldThrowError(true);
  };

  const resetError = () => {
    setShouldThrowError(false);
    clearError();
  };

  const tabs = [
    { label: 'Error Boundaries', value: 0 },
    { label: 'Loading States', value: 1 },
    { label: 'Skeletons', value: 2 },
    { label: 'Interactive Tests', value: 3 }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Error Boundaries & Loading States Test
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        This page demonstrates all error boundary and loading state components
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Paper>

      {/* Error Boundaries Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Error Boundary Examples
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Error Boundary
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    This component is wrapped with an ErrorBoundary
                  </Typography>
                  
                  <ErrorBoundary>
                    <ErrorThrower shouldThrow={shouldThrowError} />
                  </ErrorBoundary>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={triggerError}
                      disabled={shouldThrowError}
                      sx={{ mr: 1 }}
                    >
                      Throw Error
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={resetError}
                      disabled={!shouldThrowError}
                    >
                      Reset
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Error Handler Hook
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Using the useErrorHandler hook for functional components
                  </Typography>
                  
                  {error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error.message}
                    </Alert>
                  ) : (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      No error currently
                    </Alert>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={() => handleError(new Error('Test error from hook'))}
                  >
                    Trigger Hook Error
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Loading States Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Loading State Examples
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <LoadingSimulator type="spinner" />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LoadingSimulator type="progress" />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LoadingSimulator type="overlay" />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Loading with Retry
                  </Typography>
                  <LoadingWithRetry
                    loading={false}
                    error={null}
                    onRetry={() => console.log('Retry clicked')}
                    loadingMessage="Loading data..."
                    errorMessage="Failed to load data"
                  >
                    <Typography>Content loaded successfully!</Typography>
                  </LoadingWithRetry>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Skeletons Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Skeleton Examples
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Card Skeleton
              </Typography>
              <CardSkeleton />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                List Skeleton
              </Typography>
              <ListSkeleton items={3} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Form Skeleton
              </Typography>
              <FormSkeleton fields={3} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Table Skeleton
              </Typography>
              <TableSkeleton rows={4} columns={5} />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dashboard Skeleton
              </Typography>
              <DashboardSkeleton />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Interactive Tests Tab */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Interactive Tests
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Full Page Loading
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Click to show full page loading overlay
                  </Typography>
                  
                  <Button
                    variant="contained"
                    onClick={() => {
                      // This would typically be controlled by app state
                      console.log('Full page loading triggered');
                    }}
                  >
                    Show Full Page Loading
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Content Skeleton Types
                  </Typography>
                  
                  <List dense>
                    {['text', 'card', 'table', 'list', 'form'].map((type) => (
                      <ListItem key={type}>
                        <ListItemText 
                          primary={type.charAt(0).toUpperCase() + type.slice(1)} 
                          secondary={<ContentSkeleton type={type} lines={2} />}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ErrorLoadingTest;
