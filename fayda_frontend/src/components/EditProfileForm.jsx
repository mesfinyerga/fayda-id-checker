import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function EditProfileForm({ open, onClose, profile, setProfile }) {
  const { updateProfile } = useAuth();
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(profile); }, [profile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    const updated = await updateProfile({
      full_name: form.full_name,
      email: form.email,
      bio: form.bio,
      phone: form.phone,
      company: form.company,
    });
    setProfile(updated);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <TextField margin="dense" name="full_name" label="Full Name" fullWidth variant="standard"
          value={form?.full_name || ""} onChange={handleChange} />
        <TextField margin="dense" name="email" label="Email" fullWidth variant="standard"
          value={form?.email || ""} onChange={handleChange} />
        <TextField margin="dense" name="bio" label="Bio" fullWidth variant="standard"
          value={form?.bio || ""} onChange={handleChange} multiline minRows={2} />
        <TextField margin="dense" name="phone" label="Phone" fullWidth variant="standard"
          value={form?.phone || ""} onChange={handleChange} />
        <TextField margin="dense" name="company" label="Company" fullWidth variant="standard"
          value={form?.company || ""} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
