import React, { useState } from 'react';
import {
  TextField, Button, Container, Grid, Typography, MenuItem
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
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Register New Client
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField label="Full Name" name="full_name" fullWidth required value={userData.full_name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" type="email" fullWidth required value={userData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" name="password" type="password" fullWidth required value={userData.password} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Confirm Password" name="confirmPassword" type="password" fullWidth required value={userData.confirmPassword} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Phone" name="phone" fullWidth value={userData.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Company" name="company" fullWidth value={userData.company} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Avatar URL" name="avatar_url" fullWidth value={userData.avatar_url} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Bio" name="bio" fullWidth multiline rows={2} value={userData.bio} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" name="notes" fullWidth multiline rows={2} value={userData.notes} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField select label="Plan Type" name="plan_type" fullWidth value={userData.plan_type} onChange={handleChange}>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField select label="Status" name="status" fullWidth value={userData.status} onChange={handleChange}>
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
