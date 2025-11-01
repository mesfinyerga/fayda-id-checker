import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Alert, Box, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Helper: Parse JWT and extract payload
function parseJwt(token) {
  if (!token) return {};
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Form data as x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = res.data;
      const decoded = parseJwt(access_token);
      // Save token & role (from JWT or fallback to 'user')
      login(access_token, decoded.role || 'user');

      // Redirect by role
      if (decoded.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setErrorMsg('❌ Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
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
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          {errorMsg && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                bgcolor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                border: '1px solid var(--color-danger)'
              }}
            >
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'var(--color-border)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-primary)',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: 'var(--color-border)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'var(--color-primary)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'var(--color-primary)',
                      borderWidth: '2px',
                    },
                  },
                }}
              />

              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
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
                    },
                    '&:disabled': {
                      background: 'var(--color-disabled)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                </Button>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 2 }}>
                  Don't have an account?{' '}
                  <Button
                    onClick={() => navigate('/register')}
                    sx={{
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </Typography>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginForm;
