import React, { useState } from 'react';
import api from '../utils/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Grid
} from '@mui/material';

const RegisterClientModal = ({ open, onClose, refreshUsers }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    plan_type: 'basic',
    status: 'unpaid',
    role: 'user',
    phone: '',
    company: '',
    avatar_url: '',
    bio: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async () => {
    // Omit empty optional fields
    const payload = {};
    Object.keys(form).forEach((key) => {
      if (form[key] !== '') payload[key] = form[key];
    });

    try {
      const res = await api.post("/register/", payload);

      if (res.status === 200 || res.status === 201) {
        alert("✅ Client registered successfully");
        onClose();
        if (refreshUsers) refreshUsers();
      } else {
        alert("❌ Registration failed");
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Register New Client</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Full Name" name="full_name" fullWidth required value={form.full_name} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" fullWidth required value={form.email} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Password" name="password" type="password" fullWidth required value={form.password} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" fullWidth value={form.phone} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Company" name="company" fullWidth value={form.company} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Avatar URL" name="avatar_url" fullWidth value={form.avatar_url} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Bio" name="bio" fullWidth multiline rows={2} value={form.bio} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Notes" name="notes" fullWidth multiline rows={2} value={form.notes} onChange={handleInputChange} />
          </Grid>
          <Grid item xs={4}>
            <TextField select label="Plan Type" name="plan_type" fullWidth value={form.plan_type} onChange={handleInputChange}>
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField select label="Status" name="status" fullWidth value={form.status} onChange={handleInputChange}>
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={4}>
            <TextField select label="Role" name="role" fullWidth value={form.role} onChange={handleInputChange}>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleRegisterSubmit}>Register</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterClientModal;
