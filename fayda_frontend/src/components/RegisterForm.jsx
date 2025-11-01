import React, { useState } from 'react';
import {
  TextField, Button, Container, Grid, Typography, MenuItem, Paper, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan_type: 'basic',
    status: 'unpaid',
    phone: '',
    company: '',
    avatar_url: '',
    bio: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Prepare payload (remove confirmPassword)
    const { confirmPassword, ...payload } = userData;

    // Omit empty strings for optional fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === "") delete payload[key];
    });

    try {
      const success = await register(payload);
      if (success) {
        alert('✅ Client registered successfully');
        navigate('/login');
      } else {
        alert('❌ Registration failed');
      }
    } catch (error) {
      alert('⚠️ Network or server error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #14b8a6 100%),
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.15) 0%, transparent 50%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill-opacity=\'0.03\'%3E%3Cpolygon fill=\'%23ffffff\' points=\'50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40\'/%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(0, 0, 0, 0.1)',
            animation: 'fadeInScale 0.6s ease-out'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                mb: 1
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              Join Fayda ID Checker and start verifying IDs today
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              required
              value={userData.full_name}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={userData.email}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={userData.password}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              required
              value={userData.confirmPassword}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={userData.phone}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company"
              name="company"
              fullWidth
              value={userData.company}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Plan Type"
              name="plan_type"
              fullWidth
              value={userData.plan_type}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={userData.status}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                }
              }}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Create Account
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
      </Container>
    </Box>
  );
};

export default Register;
