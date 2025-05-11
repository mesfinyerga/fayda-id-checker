import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const handleGoToDashboard = () => {
    if (!token) {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/user');
    }
  };

  const getButtonLabel = () => {
    if (!token) return 'Login to Start';
    if (role === 'admin') return 'Go to Admin Panel';
    return 'Go to User Dashboard';
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        🔐 Fayda ID Checker System
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        A secure and smart way for individuals and institutions to verify Ethiopian Fayda National ID numbers.
        Login or register to begin.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGoToDashboard}
        >
          {getButtonLabel()}
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
