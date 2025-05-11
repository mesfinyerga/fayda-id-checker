import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterClientModal from '../components/RegisterClientModal';

const AdminDashboard = () => {
  const { token, role, getUsers, updateUserStatus, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [token, role]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'unpaid' ? 'paid' : 'unpaid';
    await updateUserStatus(userId, newStatus);
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
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
        <Button variant="contained" onClick={() => setModalOpen(true)}>
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
              <TableCell>Role</TableCell>
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
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={user.status === 'unpaid' ? 'success' : 'warning'}
                    onClick={() => handleStatusToggle(user.id, user.status)}
                  >
                    {user.status === 'unpaid' ? 'Mark as Paid' : 'Mark as Unpaid'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <RegisterClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshUsers={fetchUsers}
      />
    </Container>
  );
};

export default AdminDashboard;
