import React from "react";
import {
  Typography,
  Paper,
  Box,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import IDCheckForm from "../components/IDCheckForm";
import PaymentHistory from "../components/PaymentHistory";
import Layout from "../components/layout/Layout";
import PageHeader from "../components/layout/PageHeader";
import { semanticColors } from "../utils/designTokens";

const UserDashboard = () => {
  const { role } = useAuth();

  return (
    <Layout>
      <PageHeader
        title="User Dashboard"
        subtitle="Welcome to your personal dashboard. Check IDs, track usage, and manage your account."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' }
        ]}
      />

      {/* Profile Header */}
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
        
        <Grid container alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                width: { xs: 70, md: 90 }, 
                height: { xs: 70, md: 90 },
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                border: '3px solid rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
              }}
            >
              👤
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography 
              variant="h4" 
              fontWeight="800" 
              gutterBottom 
              sx={{ 
                color: semanticColors.textInverse,
                fontSize: { xs: '1.75rem', md: '2rem' },
                mb: 1
              }}
            >
              Welcome back!
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.95)', variant: 'body1', fontSize: '1.1rem' }}>
              You are logged in as <strong>{role}</strong> • Ready to verify IDs
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            bgcolor: semanticColors.surface,
            border: `1px solid ${semanticColors.border}`,
            borderRadius: '20px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            animation: 'fadeInScale 0.7s ease-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)',
              borderColor: semanticColors.primary
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: semanticColors.primary,
                fontWeight: 600,
                mb: 3
              }}>
                🛠️ What You Can Do
              </Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="✅ Check Ethiopian Fayda ID numbers" 
                    primaryTypographyProps={{ 
                      sx: { 
                        fontWeight: 500,
                        color: semanticColors.text
                      } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="📊 Track your verification usage" 
                    primaryTypographyProps={{ 
                      sx: { 
                        fontWeight: 500,
                        color: semanticColors.text
                      } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="💳 View your payment and subscription details" 
                    primaryTypographyProps={{ 
                      sx: { 
                        fontWeight: 500,
                        color: semanticColors.text
                      } 
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText 
                    primary="⚙️ Update your profile or settings" 
                    primaryTypographyProps={{ 
                      sx: { 
                        fontWeight: 500,
                        color: semanticColors.text
                      } 
                    }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            bgcolor: semanticColors.surface,
            border: `1px solid ${semanticColors.border}`,
            borderRadius: '20px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            animation: 'fadeInScale 0.7s ease-out',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)',
              borderColor: semanticColors.success
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: semanticColors.success,
                fontWeight: 600,
                mb: 3
              }}>
                📈 Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: semanticColors.infoBg,
                  border: `1px solid ${semanticColors.info}`,
                }}>
                  <Typography variant="body2" sx={{ color: semanticColors.textMuted, fontWeight: 500 }}>
                    Total Verifications
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: semanticColors.info }}>
                    0
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: semanticColors.successBg,
                  border: `1px solid ${semanticColors.success}`,
                }}>
                  <Typography variant="body2" sx={{ color: semanticColors.textMuted, fontWeight: 500 }}>
                    Account Status
                  </Typography>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      backgroundColor: semanticColors.success,
                      color: semanticColors.primaryContrast,
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    Active
                  </Box>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: semanticColors.infoBg,
                  border: `1px solid ${semanticColors.info}`,
                }}>
                  <Typography variant="body2" sx={{ color: semanticColors.textMuted, fontWeight: 500 }}>
                    Plan Type
                  </Typography>
                  <Typography variant="body1" fontWeight="600" sx={{ color: semanticColors.info }}>
                    Basic
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ID Check Form Section */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: '20px',
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        animation: 'fadeInScale 0.8s ease-out'
      }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: semanticColors.primary,
            fontWeight: 600
          }}>
            🔍 Fayda ID Verification
          </Typography>
          <Typography variant="body2" sx={{ color: semanticColors.textMuted, mb: 2 }}>
            Enter an Ethiopian Fayda ID number to verify its authenticity and retrieve associated information.
          </Typography>
        </Box>
        <Divider sx={{ my: 3, borderColor: semanticColors.border }} />
        <IDCheckForm />
      </Paper>

      {/* Payment History Section */}
      <Paper elevation={0} sx={{ 
        borderRadius: '20px',
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        animation: 'fadeInScale 0.9s ease-out',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 3, 
          borderBottom: `1px solid ${semanticColors.border}`,
          background: semanticColors.bg,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <Typography variant="h5" sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            color: semanticColors.primary,
            fontWeight: 600
          }}>
            💳 Payment History
          </Typography>
          <Typography variant="body2" sx={{ color: semanticColors.textMuted, mt: 1 }}>
            View your transaction history and subscription details
          </Typography>
        </Box>
        <PaymentHistory />
      </Paper>
    </Layout>
  );
};

export default UserDashboard;
