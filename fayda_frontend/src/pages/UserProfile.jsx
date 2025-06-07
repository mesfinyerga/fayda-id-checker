// src/pages/UserProfile.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  Container, Paper, Typography, Avatar, TextField, Button, Box,
  Grid, Divider, CircularProgress, Alert, Chip, Fade
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import PaymentHistory from "../components/PaymentHistory";

export default function UserProfile() {
  const { fetchProfile, updateProfile, uploadAvatar, token } = useAuth();
  const [profile, setProfile] = useState(null);           // Fetched backend profile
  const [editData, setEditData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
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
      setMsg("✅ Avatar updated!");
    } catch {
      setError("❌ Failed to upload avatar.");
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setSaving(true); setMsg(""); setError("");
    try {
      const updated = await updateProfile(editData);
      setProfile(updated); // Refresh UI with backend response
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
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!profile) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Alert severity="error">Not logged in or session expired. Please log in again.</Alert>
      </Box>
    );
  }


  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Paper elevation={6} sx={{ p: 5, borderRadius: 4, bgcolor: "#f7faff" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {profile?.role === "admin" ? "Admin Profile" : "User Profile"}
          {profile?.plan_type && (
            <Chip
              label={`Plan: ${profile.plan_type}`}
              color="secondary"
              size="small"
              sx={{ ml: 2, fontWeight: 'bold', textTransform: 'capitalize' }}
            />
          )}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={3} sx={{ textAlign: "center" }}>
            <Fade in>
              <Avatar
                src={avatarUrl}
                sx={{ width: 108, height: 108, mx: "auto", mb: 2, border: "3px solid #1976d2" }}
              />
            </Fade>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current.click()}
              sx={{ mb: 1, width: "100%" }}
              disabled={!editMode}
            >
              Change Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarFile && (
              <Button
                size="small"
                variant="contained"
                onClick={handleAvatarUpload}
                sx={{ mt: 1, width: "100%" }}
              >
                Upload
              </Button>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Box component="form" noValidate autoComplete="off">
              <TextField
                name="full_name"
                label="Full Name"
                fullWidth
                value={editData.full_name || ""}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                name="email"
                label="Email"
                fullWidth
                value={editData.email || ""}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                name="phone"
                label="Phone"
                fullWidth
                value={editData.phone || ""}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                name="company"
                label="Company"
                fullWidth
                value={editData.company || ""}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                name="bio"
                label="Bio"
                fullWidth
                multiline
                minRows={2}
                value={editData.bio || ""}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                name="notes"
                label="Notes"
                fullWidth
                multiline
                minRows={1}
                value={editData.notes || ""}
                onChange={handleChange}
                disabled={!editMode}
                sx={{ mb: 2 }}
              />
              <TextField
                name="role"
                label="Role"
                fullWidth
                value={editData.role || ""}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                name="status"
                label="Status"
                fullWidth
                value={editData.status || ""}
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                name="plan_type"
                label="Plan Type"
                fullWidth
                value={editData.plan_type || ""}
                disabled
                sx={{ mb: 2 }}
              />

              {!editMode ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  sx={{ mr: 2, fontWeight: "bold" }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ mr: 2, fontWeight: "bold" }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        {/* Payments history below */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Payment & Subscription History
        </Typography>
        <PaymentHistory />
      </Paper>
    </Container>
  );
}
