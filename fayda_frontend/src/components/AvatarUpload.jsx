import React, { useRef, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AvatarUpload({ setProfile }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:8000/users/me/avatar", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile((p) => ({ ...p, avatar_url: res.data.avatar_url }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleChange}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => inputRef.current.click()}
        disabled={loading}
        sx={{ ml: 2 }}
      >
        {loading ? <CircularProgress size={20} /> : "Change Photo"}
      </Button>
    </>
  );
}
