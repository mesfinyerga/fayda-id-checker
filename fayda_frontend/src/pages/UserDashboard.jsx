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
            linear-gradient(135deg, #3d5c6f 0%, #4a6b7f 50%, #3d5c6f 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          borderRadius: 3,
          color: semanticColors.textInverse,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        
        <Grid container alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.2)', 
                width: 80, 
                height: 80,
                fontSize: '2rem',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              👤
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: semanticColors.textInverse }}>
              Welcome back!
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', variant: 'body1' }}>
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
            '&:hover': {
              boxShadow: 'var(--shadow-md)',
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
            '&:hover': {
              boxShadow: 'var(--shadow-md)',
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
        borderRadius: 3,
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
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
        borderRadius: 3,
        bgcolor: semanticColors.surface,
        border: `1px solid ${semanticColors.border}`,
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
