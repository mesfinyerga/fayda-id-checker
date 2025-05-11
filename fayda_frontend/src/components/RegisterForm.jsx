import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Grid,
  Typography,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth(); // Custom hook to call backend
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    plan: 'basic',
    paymentStatus: 'unpaid',
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

    const payload = {
      full_name: userData.name,
      email: userData.email,
      password: userData.password,
      plan_type: userData.plan,
      status: userData.paymentStatus,
    };

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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Register New Client
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              required
              value={userData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={userData.email}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={userData.password}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              required
              value={userData.confirmPassword}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Plan Type"
              name="plan"
              fullWidth
              value={userData.plan}
              onChange={handleChange}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Payment Status"
              name="paymentStatus"
              fullWidth
              value={userData.paymentStatus}
              onChange={handleChange}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Register Client
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Register;
