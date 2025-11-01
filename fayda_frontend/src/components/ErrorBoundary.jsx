import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert,
  AlertTitle,
  Container
} from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      error: error,
      errorId: Date.now() // Generate unique error ID for tracking
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In a production app, you would log this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReportError = () => {
    // In a real app, this would open a form to report the error
    // For now, we'll just log it
    console.log('Error Report:', {
      errorId: this.state.errorId,
      error: this.state.error,
      errorInfo: this.state.errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // You could also send this to your backend API
    // Example: reportErrorToAPI(errorData);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2
            }}
          >
            <Box sx={{ mb: 3 }}>
              <ErrorIcon 
                sx={{ 
                  fontSize: 64, 
                  color: 'error.main',
                  mb: 2
                }} 
              />
            </Box>

            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We encountered an unexpected error. Don't worry, our team has been notified.
            </Typography>

            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              <AlertTitle>Error Details</AlertTitle>
              <Typography variant="body2" component="div">
                <strong>Error ID:</strong> {this.state.errorId}
              </Typography>
              {this.state.error && (
                <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                  <strong>Error:</strong> {this.state.error.message}
                </Typography>
              )}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={this.handleRetry}
                sx={{ minWidth: 120 }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outlined"
                onClick={this.handleReportError}
                sx={{ minWidth: 120 }}
              >
                Report Error
              </Button>
            </Box>

            {import.meta.env.DEV && this.state.errorInfo && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Development Details
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'grey.50',
                    maxHeight: 200,
                    overflow: 'auto'
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
                    {this.state.errorInfo.componentStack}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export const withErrorBoundary = (WrappedComponent, fallbackComponent = null) => {
  return class extends React.Component {
    render() {
      return (
        <ErrorBoundary fallbackComponent={fallbackComponent}>
          <WrappedComponent {...this.props} />
        </ErrorBoundary>
      );
    }
  };
};

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const handleError = React.useCallback((error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export default ErrorBoundary;
