import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Collapse,
  IconButton,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import api from '../utils/api';


const IDCheckForm = () => {
  const [idNumber, setIdNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await api.get(
        `/id/mock-id-check/${idNumber}`
      );
      setResult(res.data);
    } catch (err) {
      console.error("❌ Error response:", err.response?.data || err.message);
      setError('❌ Failed to check ID. Are you logged in as a user?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card elevation={5} sx={{ maxWidth: 700, mx: 'auto', mt: 5, borderRadius: 3 }}>
      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
        <Box display="flex" alignItems="center">
          <PermIdentityIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Fayda ID Verification</Typography>
        </Box>
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Fayda ID Number"
              placeholder="e.g. 123456789"
              fullWidth
              required
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Check ID'}
            </Button>
          </form>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          {result && (
            <Box sx={{ mt: 3 }}>
              {result.valid ? (
                <>
                  <Alert severity="success">✅ ID is valid!</Alert>
                  <Typography mt={1}>👤 Name: {result.name}</Typography>
                  <Typography>DOB: {result.dob}</Typography>
                  {result.photo && (
                    <img
                      src={result.photo}
                      alt="ID"
                      style={{ width: 120, marginTop: 12, borderRadius: 8 }}
                    />
                  )}
                </>
              ) : (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  ❌ Invalid ID: {result.reason}
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default IDCheckForm;
