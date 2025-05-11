import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { token, role, getUsers, updateUserStatus } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const fetched = await getUsers();
        setUsers(fetched);
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, role]);

  const handleUpdateStatus = async (userId, newStatus) => {
    await updateUserStatus(userId, newStatus);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box mb={2}>
        <Button variant="contained" onClick={() => navigate('/register')}>
          Add New Client
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status || 'unpaid'}</TableCell>
                <TableCell>{user.plan_type}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={user.status === 'unpaid' ? 'success' : 'warning'}
                    onClick={() =>
                      handleUpdateStatus(user.id, user.status === 'unpaid' ? 'paid' : 'unpaid')
                    }
                  >
                    {user.status === 'unpaid' ? 'Mark as Paid' : 'Mark as Unpaid'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;
