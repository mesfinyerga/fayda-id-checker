import React, { useEffect, useState } from "react";
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
  Toolbar,
  TextField,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterClientModal from "../components/RegisterClientModal";

const AdminDashboard = () => {
  const { token, role, getUsers, updateUserStatus, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const fetched = await getUsers();
      setUsers(fetched);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [token, role]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === "unpaid" ? "paid" : "unpaid";
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

  // Filtering logic
  const filteredUsers = users.filter((user) => {
    let matches = true;
    if (statusFilter) matches = matches && user.status === statusFilter;
    if (roleFilter) matches = matches && user.role === roleFilter;
    if (search)
      matches =
        matches &&
        (user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()));
    return matches;
  });

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
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
      {/* Filters */}
      <Toolbar disableGutters sx={{ gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="unpaid">Unpaid</MenuItem>
        </Select>
        {(roleFilter || statusFilter || search) && (
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setRoleFilter("");
              setStatusFilter("");
              setSearch("");
            }}
          >
            Clear Filters
          </Button>
        )}
      </Toolbar>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status || "unpaid"}</TableCell>
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
                    color={user.status === "unpaid" ? "success" : "warning"}
                    onClick={() =>
                      handleStatusToggle(user.id, user.status)
                    }
                  >
                    {user.status === "unpaid" ? "Mark as Paid" : "Mark as Unpaid"}
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
