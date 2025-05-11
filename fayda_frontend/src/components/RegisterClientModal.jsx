import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Grid
} from '@mui/material';

const RegisterClientModal = ({ open, onClose, refreshUsers }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    plan: 'basic',
    status: 'unpaid',
    role: 'user',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async () => {
    const payload = {
      full_name: form.full_name,
      email: form.email,
      password: form.password,
      plan_type: form.plan,
      status: form.status,
      role: form.role,
    };

    try {
      const res = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Client registered successfully");
        onClose();
        refreshUsers(); // Fetch updated list
      } else {
        const error = await res.json();
        alert("❌ Error: " + (error.detail || "Registration failed"));
      }
    } catch (err) {
      alert("❌ Network error: " + err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register New Client</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              required
              value={form.full_name}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              required
              value={form.email}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={handleInputChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Plan Type"
              name="plan"
              fullWidth
              value={form.plan}
              onChange={handleInputChange}
            >
              <MenuItem value="basic">Basic</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Status"
              name="status"
              fullWidth
              value={form.status}
              onChange={handleInputChange}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Role"
              name="role"
              fullWidth
              value={form.role}
              onChange={handleInputChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleRegisterSubmit}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterClientModal;
