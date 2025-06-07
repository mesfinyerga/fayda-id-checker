import React from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import IDCheckForm from "../components/IDCheckForm";
import PaymentHistory from "../components/PaymentHistory";

const UserDashboard = () => {
  const { role, token } = useAuth();

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      {/* Profile Header */}
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4, background: "linear-gradient(90deg, #e3f2fd, #bbdefb)" }}>
        <Grid container alignItems="center" spacing={2}>
        <Grid>
          <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56 }}>👤</Avatar>
        </Grid>
        <Grid sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to Your Dashboard
          </Typography>
          <Typography color="text.secondary">
            You are logged in as <strong>{role}</strong>
          </Typography>
        </Grid>
       </Grid>

      </Paper>

      {/* Instruction Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          🛠️ What You Can Do
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="✅ Check Ethiopian Fayda ID numbers" />
          </ListItem>
          <ListItem>
            <ListItemText primary="📊 Track your verification usage" />
          </ListItem>
          <ListItem>
            <ListItemText primary="💳 View your payment and subscription details" />
          </ListItem>
          <ListItem>
            <ListItemText primary="⚙️ Update your profile or settings" />
          </ListItem>
        </List>
      </Paper>

      {/* ID Check Form Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          🔍 Fayda ID Verification
        </Typography>
        <Divider sx={{ my: 2 }} />
        <IDCheckForm />
      </Paper>

      {/* Payment History Section */}
      <PaymentHistory />
    </Container>
  );
};

export default UserDashboard;
