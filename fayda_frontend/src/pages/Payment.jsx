import React, { useState } from "react";
import api from "../utils/api";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon
} from "@mui/icons-material";
import Layout from "../components/layout/Layout";
import PageHeader from "../components/layout/PageHeader";
import { semanticColors } from "../utils/designTokens";

const PAYMENT_ENDPOINT = "/payments/";

export default function Payment() {
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
      const response = await api.post(
        PAYMENT_ENDPOINT,
        { amount: parseFloat(amount), method },
        {}
      );
      setResult(response.data);
    } catch (err) {
      setError("Payment simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: "Telebirr", icon: <AccountBalanceIcon />, color: semanticColors.primary },
    { value: "Stripe", icon: <CreditCardIcon />, color: semanticColors.info },
    { value: "MockPay", icon: <PaymentIcon />, color: semanticColors.secondary }
  ];

  return (
    <Layout>
      <PageHeader
        title="Payment"
        subtitle="Simulate payments and manage your subscription"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Payment', href: '/payment' }
        ]}
      />

      <Grid container spacing={4}>
        {/* Payment Form */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: '20px',
              bgcolor: semanticColors.surface,
              border: `1px solid ${semanticColors.border}`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              animation: 'fadeInScale 0.6s ease-out'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)'
                }}
              >
                <PaymentIcon sx={{ fontSize: 40, color: semanticColors.primary }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: semanticColors.text, mb: 0.5 }}>
                  Make a Payment
                </Typography>
                <Typography variant="body2" sx={{ color: semanticColors.textMuted }}>
                  Simulate payment transactions for testing
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, borderColor: semanticColors.border }} />

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Amount (ETB)"
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                    }
                  }}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: semanticColors.textMuted }}>ETB</Typography>
                  }}
                />
                <Select
                  value={method}
                  label="Payment Method"
                  onChange={(e) => setMethod(e.target.value)}
                  fullWidth
                  sx={{
                    borderRadius: '12px',
                  }}
                >
                  {paymentMethods.map((pm) => (
                    <MenuItem key={pm.value} value={pm.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: pm.color }}>{pm.icon}</Box>
                        {pm.value}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.75,
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    textTransform: 'none',
                    mt: 2,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: semanticColors.disabled
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <>
                      <PaymentIcon sx={{ mr: 1 }} />
                      Process Payment
                    </>
                  )}
                </Button>
              </Box>
            </form>

            {result && (
              <Alert
                severity={result.status === "success" ? "success" : "error"}
                sx={{
                  mt: 4,
                  borderRadius: '12px',
                  bgcolor: result.status === "success" ? semanticColors.successBg : semanticColors.dangerBg,
                  color: result.status === "success" ? semanticColors.success : semanticColors.danger,
                  border: `1px solid ${result.status === "success" ? semanticColors.success : semanticColors.danger}`
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Payment {result.status === "success" ? "Successful" : "Failed"}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                  <Typography><strong>Amount:</strong> ETB {result.amount}</Typography>
                  <Typography><strong>Method:</strong> {result.method}</Typography>
                  <Typography><strong>Reference:</strong> {result.reference}</Typography>
                  <Typography><strong>Date:</strong> {new Date(result.created_at).toLocaleString()}</Typography>
                </Box>
              </Alert>
            )}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  borderRadius: '12px',
                  bgcolor: semanticColors.dangerBg,
                  color: semanticColors.danger,
                  border: `1px solid ${semanticColors.danger}`
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Payment Methods Info */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: '20px',
              bgcolor: semanticColors.surface,
              border: `1px solid ${semanticColors.border}`,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              animation: 'fadeInScale 0.7s ease-out'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: semanticColors.text }}>
                Available Payment Methods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {paymentMethods.map((pm) => (
                  <Box
                    key={pm.value}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: `1px solid ${semanticColors.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: pm.color,
                        bgcolor: `${pm.color}10`,
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Box sx={{ color: pm.color, display: 'flex', alignItems: 'center' }}>
                      {pm.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 500, color: semanticColors.text }}>
                      {pm.value}
                    </Typography>
                    {method === pm.value && (
                      <Chip
                        label="Selected"
                        size="small"
                        sx={{
                          ml: 'auto',
                          bgcolor: pm.color,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
