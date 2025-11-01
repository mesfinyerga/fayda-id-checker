// src/pages/UserProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Container, Paper, Typography, Avatar, TextField, Button, Box,
  Grid, Divider, CircularProgress, Alert, Chip, Fade, Card, CardContent,
  IconButton, Stack, Badge, Tabs, Tab, List, ListItem, ListItemText,
  ListItemIcon, Switch, FormControlLabel, Divider as MuiDivider
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Notes as NotesIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Flag as FlagIcon,
  Language as LanguageIcon
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import PaymentHistory from "../components/PaymentHistory";
import Layout from "../components/layout/Layout";
import PageHeader from "../components/layout/PageHeader";

export default function UserProfile() {
  const { fetchProfile, updateProfile, uploadAvatar, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef(null);

  // Fetch profile on mount & after avatar/profile update
  useEffect(() => {
    setLoading(true);
    setError("");
    fetchProfile()
      .then((data) => {
        setProfile(data || {});
        setEditData(data || {});
        setAvatarUrl(data?.avatar_url || "");
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, [fetchProfile]);

  // Handle input changes
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Avatar file select
  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Upload avatar
  const handleAvatarUpload = async () => {
    setMsg(""); setError("");
    if (!avatarFile) return;
    try {
      const newUrl = await uploadAvatar(avatarFile);
      setAvatarUrl(newUrl);
      setEditData((prev) => ({ ...prev, avatar_url: newUrl }));
      setProfile((prev) => ({ ...prev, avatar_url: newUrl }));
      setAvatarFile(null);
      setMsg("✅ Avatar updated successfully!");
    } catch {
      setError("❌ Failed to upload avatar.");
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setSaving(true); setMsg(""); setError("");
    try {
      const updated = await updateProfile(editData);
      setProfile(updated);
      setMsg("✅ Profile updated successfully!");
      setEditMode(false);
    } catch {
      setError("❌ Update failed.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setEditMode(false);
    setEditData(profile || {});
    setAvatarFile(null);
    setAvatarUrl(profile?.avatar_url || "");
    setMsg(""); setError("");
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'var(--color-bg)'
      }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        background: 'var(--color-bg)'
      }}>
        <Alert severity="error">Not logged in or session expired. Please log in again.</Alert>
      </Box>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'var(--color-danger)';
      case 'client': return 'var(--color-info)';
      default: return 'var(--color-success)';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--color-success)';
      case 'inactive': return 'var(--color-danger)';
      default: return 'var(--color-warning)';
    }
  };

  return (
    <Layout>
      <PageHeader
        title="User Profile"
        subtitle="Manage your account settings and personal information"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Profile', href: '/profile' }
        ]}
      />
      <Box sx={{ 
        animation: 'fadeIn 0.4s ease-out'
      }}>
      <Container maxWidth="lg">
        {/* Header Section with Ethiopian Flag Colors */}
        <Box sx={{ 
          background: `
            linear-gradient(135deg, #009639 0%, #FEDD00 33%, #DA121A 66%, #009639 100%),
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
          `,
          borderRadius: '20px',
          p: 4,
          mb: 4,
          color: 'var(--color-text-inverse)',
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
            background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill-opacity=\'0.05\'%3E%3Cpolygon fill=\'%23ffffff\' points=\'50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40\'/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }} />
          
          <Grid container spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    onClick={() => fileInputRef.current.click()}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.9)',
                      color: 'var(--color-primary)',
                      '&:hover': { bgcolor: 'var(--color-text-inverse)' },
                      width: 32,
                      height: 32
                    }}
                    disabled={!editMode}
                    aria-label="Change profile photo"
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                }
              >
                <Avatar
                  src={avatarUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid var(--color-text-inverse)',
                    boxShadow: 'var(--shadow-xl)'
                  }}
                  alt={profile?.full_name ? `${profile.full_name} profile photo` : 'User profile photo'}
                />
              </Badge>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarChange}
                aria-label="Upload profile photo"
              />
              {avatarFile && (
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleAvatarUpload}
                  sx={{
                    mt: 2,
                    bgcolor: 'var(--color-text-inverse)',
                    color: 'var(--color-primary)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Upload Photo
                </Button>
              )}
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="h3" fontWeight="bold">
                    {profile?.full_name || 'User Profile'}
                  </Typography>
                  <Chip
                    icon={<FlagIcon />}
                    label="Ethiopia"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'var(--color-text-inverse)',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    icon={<VerifiedIcon />}
                    label={profile?.role || 'User'}
                    sx={{
                      bgcolor: getRoleColor(profile?.role),
                      color: 'var(--color-text-inverse)',
                      fontWeight: 'bold'
                    }}
                  />
                  {profile?.plan_type && (
                    <Chip
                      icon={<StarIcon />}
                      label={`${profile.plan_type} Plan`}
                      sx={{
                        bgcolor: '#D4AF37',
                        color: 'var(--color-text-inverse)',
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                      }}
                    />
                  )}
                </Box>
                
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {profile?.email || 'user@example.com'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<SecurityIcon />}
                    label={`Status: ${profile?.status || 'Active'}`}
                    sx={{
                      bgcolor: getStatusColor(profile?.status),
                      color: 'var(--color-text-inverse)',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    icon={<LanguageIcon />}
                    label="English / አማርኛ"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'var(--color-text-inverse)',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Messages */}
        {msg && <Alert severity="success" sx={{ mb: 3 }}>{msg}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Main Content Tabs */}
        <Card sx={{ 
          borderRadius: '20px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--color-border)',
          animation: 'fadeInScale 0.7s ease-out'
        }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              bgcolor: 'var(--color-primary)',
              '& .MuiTab-root': {
                color: 'var(--color-text-inverse)',
                fontWeight: 'bold',
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }
            }}
          >
            <Tab icon={<PersonIcon />} label="Profile Information" />
            <Tab icon={<PaymentIcon />} label="Payment History" />
            <Tab icon={<SettingsIcon />} label="Account Settings" />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Grid container spacing={4}>
                {/* Profile Form */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color="var(--color-primary)">
                      Personal Information
                    </Typography>
                    {!editMode ? (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => setEditMode(true)}
                        sx={{
                          bgcolor: 'var(--color-primary)',
                          '&:hover': { bgcolor: 'var(--color-primary-hover)' }
                        }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<SaveIcon />}
                          onClick={handleSave}
                          disabled={saving}
                          sx={{
                            bgcolor: 'var(--color-success)',
                            '&:hover': { bgcolor: 'var(--color-success)' }
                          }}
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={handleCancel}
                          sx={{
                            borderColor: 'var(--color-danger)',
                            color: 'var(--color-danger)',
                            '&:hover': { 
                              borderColor: 'var(--color-danger)',
                              bgcolor: 'var(--color-danger-bg)'
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="full_name"
                        label="Full Name"
                        fullWidth
                        value={editData.full_name || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="email"
                        label="Email Address"
                        fullWidth
                        value={editData.email || ""}
                        disabled
                        InputProps={{
                          startAdornment: <EmailIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="phone"
                        label="Phone Number"
                        fullWidth
                        value={editData.phone || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="company"
                        label="Company/Organization"
                        fullWidth
                        value={editData.company || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <BusinessIcon sx={{ mr: 1, color: 'var(--color-primary)' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="bio"
                        label="Bio/Description"
                        fullWidth
                        multiline
                        minRows={3}
                        value={editData.bio || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'var(--color-primary)', mt: 1 }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="notes"
                        label="Additional Notes"
                        fullWidth
                        multiline
                        minRows={2}
                        value={editData.notes || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: <NotesIcon sx={{ mr: 1, color: 'var(--color-primary)', mt: 1 }} />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Account Summary */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ 
                    bgcolor: 'var(--color-surface)',
                    borderRadius: 3,
                    p: 3,
                    boxShadow: 'var(--shadow-base)'
                  }}>
                    <Typography variant="h6" fontWeight="bold" color="var(--color-primary)" gutterBottom>
                      Account Summary
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <SecurityIcon sx={{ color: 'var(--color-primary)' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Role" 
                          secondary={profile?.role || 'User'}
                          secondaryTypographyProps={{ color: getRoleColor(profile?.role) }}
                        />
                      </ListItem>
                      <MuiDivider />
                      <ListItem>
                        <ListItemIcon>
                          <VerifiedIcon sx={{ color: 'var(--color-success)' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Status" 
                          secondary={profile?.status || 'Active'}
                          secondaryTypographyProps={{ color: getStatusColor(profile?.status) }}
                        />
                      </ListItem>
                      <MuiDivider />
                      <ListItem>
                        <ListItemIcon>
                          <StarIcon sx={{ color: '#D4AF37' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Plan Type" 
                          secondary={profile?.plan_type || 'Basic'}
                          secondaryTypographyProps={{ color: '#D4AF37' }}
                        />
                      </ListItem>
                    </List>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" color="var(--color-primary)" gutterBottom>
                  Payment & Subscription History
                </Typography>
                <PaymentHistory />
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" fontWeight="bold" color="var(--color-primary)" gutterBottom>
                  Account Settings
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 'var(--shadow-base)' }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Notification Preferences
                      </Typography>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Email Notifications"
                        />
                        <FormControlLabel
                          control={<Switch defaultChecked />}
                          label="Payment Reminders"
                        />
                        <FormControlLabel
                          control={<Switch />}
                          label="Marketing Updates"
                        />
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 'var(--shadow-base)' }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Security Settings
                      </Typography>
                      <Stack spacing={2}>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                            '&:hover': { 
                              borderColor: 'var(--color-primary-hover)',
                              bgcolor: 'var(--color-info-bg)'
                            }
                          }}
                        >
                          Change Password
                        </Button>
                        <Button
                          variant="outlined"
                          fullWidth
                          sx={{
                            borderColor: 'var(--color-info)',
                            color: 'var(--color-info)',
                            '&:hover': { 
                              borderColor: 'var(--color-info)',
                              bgcolor: 'var(--color-info-bg)'
                            }
                          }}
                        >
                          Two-Factor Authentication
                        </Button>
                      </Stack>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Card>
      </Container>
      </Box>
    </Layout>
  );
}
