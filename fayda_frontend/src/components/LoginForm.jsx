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
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Login</Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
            <Button onClick={() => navigate('/register')} color="secondary">
              Register
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
