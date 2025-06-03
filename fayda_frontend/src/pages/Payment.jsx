import React, { useState } from "react";
import axios from "axios";
import { Container, Paper, Typography, TextField, Select, MenuItem, Button, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const PAYMENT_ENDPOINT = "http://localhost:8000/payments/";

export default function Payment() {
  const { token } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Telebirr");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await axios.post(
        PAYMENT_ENDPOINT,
        { amount: parseFloat(amount), method },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      setError("Payment simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          💳 Simulate Payment
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Amount (ETB)"
              type="number"
              required
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />
            <Select
              value={method}
              label="Payment Method"
              onChange={(e) => setMethod(e.target.value)}
              fullWidth
            >
              <MenuItem value="Telebirr">Telebirr</MenuItem>
              <MenuItem value="Stripe">Stripe</MenuItem>
              <MenuItem value="MockPay">MockPay</MenuItem>
            </Select>
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Simulate Payment"}
            </Button>
          </Box>
        </form>
        {result && (
          <Alert severity={result.status === "success" ? "success" : "error"} sx={{ mt: 3 }}>
            Status: <b>{result.status.toUpperCase()}</b> <br />
            Amount: <b>{result.amount}</b> <br />
            Method: <b>{result.method}</b> <br />
            Reference: <b>{result.reference}</b> <br />
            Date: <b>{new Date(result.created_at).toLocaleString()}</b>
          </Alert>
        )}
        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      </Paper>
    </Container>
  );
}
