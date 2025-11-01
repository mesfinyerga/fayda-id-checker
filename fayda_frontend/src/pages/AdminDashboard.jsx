import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  Toolbar,
  TextField,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterClientModal from "../components/RegisterClientModal";
import Layout from "../components/layout/Layout";
import PageHeader from "../components/layout/PageHeader";
import { layout, spacingUtils } from "../utils/spacing";
import { LoadingSpinner, TableSkeleton } from "../components/LoadingStates";
import { useErrorHandler } from "../components/ErrorBoundary";
import { semanticColors, sx } from "../utils/designTokens";

const AdminDashboard = () => {
  const { token, role, getUsers, updateUserStatus, updateUserRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    clearError();
    try {
      const fetched = await getUsers();
      setUsers(fetched);
    } catch (err) {
      console.error("Failed to load users:", err);
      handleError(err);
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
      <Layout>
        <LoadingSpinner message="Loading admin dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity="error" 
            onClose={clearError}
            sx={{
              bgcolor: semanticColors.dangerBg,
              color: semanticColors.danger,
              '& .MuiAlert-icon': {
                color: semanticColors.danger,
              }
            }}
          >
            <AlertTitle>Error Loading Dashboard</AlertTitle>
            {error.message || 'An error occurred while loading the dashboard data.'}
          </Alert>
        </Box>
      )}
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage users, monitor system activity, and oversee application operations"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Admin Dashboard', href: '/admin' }
        ]}
        actions={
          <Button 
            variant="contained" 
            onClick={() => setModalOpen(true)}
            sx={{ 
              minWidth: 140,
              bgcolor: semanticColors.primary,
              color: semanticColors.primaryContrast,
              '&:hover': {
                bgcolor: semanticColors.primaryHover,
              }
            }}
          >
            Add New Client
          </Button>
        }
      />

      {/* Admin Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4,
          background: `
            linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #14b8a6 100%),
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.2) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.05'%3E%3Cpolygon fill='%23ffffff' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")
          `,
          borderRadius: '20px',
          color: semanticColors.textInverse,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          animation: 'fadeInScale 0.6s ease-out',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            animation: 'pulse 4s ease-in-out infinite'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight="800" 
              gutterBottom 
              sx={{ 
                color: semanticColors.textInverse,
                fontSize: { xs: '1.75rem', md: '2rem' },
                mb: 2
              }}
            >
              System Overview
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.95)', variant: 'body1', fontSize: '1.1rem' }}>
              Total Users: <strong>{users.length}</strong> • Active: <strong>{users.filter(u => u.status === 'paid').length}</strong>
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: semanticColors.textInverse,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            Register Client
          </Button>
        </Box>
      </Paper>

      {/* Filters */}
      <Paper sx={{ 
        ...layout.card.standard, 
        ...layout.form.section,
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        animation: 'fadeInScale 0.7s ease-out'
      }}>
        <Typography variant="h6" gutterBottom sx={{ color: semanticColors.text }}>
          Filters & Search
        </Typography>
        <Toolbar disableGutters sx={{ ...spacingUtils.row(2), flexWrap: "wrap", p: 0 }}>
          <TextField
            label="Search Users"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: semanticColors.border,
                },
                '&:hover fieldset': {
                  borderColor: semanticColors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: semanticColors.focus,
                },
              },
            }}
          />
          <Select
            size="small"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            displayEmpty
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: semanticColors.border,
                },
                '&:hover fieldset': {
                  borderColor: semanticColors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: semanticColors.focus,
                },
              },
            }}
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
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: semanticColors.border,
                },
                '&:hover fieldset': {
                  borderColor: semanticColors.primary,
                },
                '&.Mui-focused fieldset': {
                  borderColor: semanticColors.focus,
                },
              },
            }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="unpaid">Unpaid</MenuItem>
          </Select>
          {(roleFilter || statusFilter || search) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setRoleFilter("");
                setStatusFilter("");
                setSearch("");
              }}
              sx={{
                borderColor: semanticColors.border,
                color: semanticColors.text,
                '&:hover': {
                  borderColor: semanticColors.primary,
                  bgcolor: semanticColors.infoBg,
                }
              }}
            >
              Clear Filters
            </Button>
          )}
        </Toolbar>
      </Paper>

      {/* Users Table */}
      <Paper sx={{ 
        overflow: 'hidden',
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
        borderRadius: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        animation: 'fadeInScale 0.8s ease-out'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: semanticColors.bg }}>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Full Name
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Email
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Status
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Plan
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Role
                </TableCell>
                <TableCell sx={{ 
                  fontWeight: 600,
                  color: semanticColors.text,
                  borderBottom: `1px solid ${semanticColors.border}`,
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: semanticColors.surfaceHover,
                    }
                  }}
                >
                  <TableCell sx={{ color: semanticColors.text }}>
                    {user.full_name}
                  </TableCell>
                  <TableCell sx={{ color: semanticColors.text }}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: user.status === 'paid' ? semanticColors.successBg : semanticColors.warningBg,
                        color: user.status === 'paid' ? semanticColors.success : semanticColors.warning,
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {user.status || "unpaid"}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: semanticColors.text }}>
                    {user.plan_type}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      size="small"
                      sx={{ 
                        minWidth: 100,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: semanticColors.border,
                          },
                          '&:hover fieldset': {
                            borderColor: semanticColors.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: semanticColors.focus,
                          },
                        },
                      }}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        handleStatusToggle(user.id, user.status)
                      }
                      size="small"
                      sx={{
                        borderColor: user.status === "unpaid" ? semanticColors.success : semanticColors.warning,
                        color: user.status === "unpaid" ? semanticColors.success : semanticColors.warning,
                        '&:hover': {
                          borderColor: user.status === "unpaid" ? semanticColors.success : semanticColors.warning,
                          bgcolor: user.status === "unpaid" ? semanticColors.successBg : semanticColors.warningBg,
                        }
                      }}
                    >
                      {user.status === "unpaid" ? "Mark as Paid" : "Mark as Unpaid"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <RegisterClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        refreshUsers={fetchUsers}
      />
    </Layout>
  );
};

export default AdminDashboard;
