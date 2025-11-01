import React from 'react';
import {
  Button,
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { semanticColors } from '../utils/designTokens';

const Home = () => {
  const navigate = useNavigate();
  const { token, role } = useAuth();

  const handleGoToDashboard = () => {
    if (!token) {
      navigate('/login');
    } else if (role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/user');
    }
  };

  const getButtonLabel = () => {
    if (!token) return 'Get Started';
    if (role === 'admin') return 'Go to Admin Panel';
    return 'Go to Dashboard';
  };

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: semanticColors.primary }} />,
      title: 'Secure Verification',
      description: 'Advanced encryption and secure protocols ensure your data protection'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: semanticColors.success }} />,
      title: 'Instant Results',
      description: 'Get verification results in seconds with our optimized system'
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: semanticColors.info }} />,
      title: 'Accurate Validation',
      description: 'High-precision algorithms for reliable ID verification'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: semanticColors.warning }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: semanticColors.bg }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(135deg, #5a7a8f 0%, #6b8ba0 50%, #5a7a8f 100%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
          color: semanticColors.textInverse,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip
                  label="🔐 Secure & Reliable"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: semanticColors.textInverse,
                    fontWeight: 600
                  }}
                />

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 2
                  }}
                >
                  Fayda ID Checker
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 400,
                    opacity: 0.9,
                    mb: 3,
                    lineHeight: 1.5
                  }}
                >
                  The most advanced and secure platform for verifying Ethiopian Fayda National ID numbers.
                  Trusted by institutions and individuals nationwide.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGoToDashboard}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: semanticColors.textInverse,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {getButtonLabel()}
                  </Button>

                  {!token && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: semanticColors.textInverse,
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        '&:hover': {
                          borderColor: semanticColors.textInverse,
                          background: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Create Account
                    </Button>
                  )}
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box
                  sx={{
                    width: { xs: 300, md: 400 },
                    height: { xs: 300, md: 400 },
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '8rem',
                    animation: 'float 6s ease-in-out infinite'
                  }}
                >
                  🔐
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: semanticColors.text
            }}
          >
            Why Choose Fayda ID Checker?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: semanticColors.textMuted,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            Experience the most reliable and secure ID verification platform with cutting-edge technology
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  bgcolor: semanticColors.surface,
                  border: `1px solid ${semanticColors.border}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 'var(--shadow-xl)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: semanticColors.text
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: semanticColors.textMuted,
                      lineHeight: 1.6
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: semanticColors.surface, py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: semanticColors.primary,
                    mb: 1
                  }}
                >
                  99.9%
                </Typography>
                <Typography variant="body2" sx={{ color: semanticColors.textMuted }}>
                  Accuracy Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: semanticColors.success,
                    mb: 1
                  }}
                >
                  &lt; 2s
                </Typography>
                <Typography variant="body2" sx={{ color: semanticColors.textMuted }}>
                  Average Response Time
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: semanticColors.info,
                    mb: 1
                  }}
                >
                  10K+
                </Typography>
                <Typography variant="body2" sx={{ color: semanticColors.textMuted }}>
                  Verifications Daily
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: semanticColors.warning,
                    mb: 1
                  }}
                >
                  24/7
                </Typography>
                <Typography variant="body2" sx={{ color: semanticColors.textMuted }}>
                  Customer Support
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
};

export default Home;
