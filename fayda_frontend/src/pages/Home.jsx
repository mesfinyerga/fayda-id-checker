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
            linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #14b8a6 100%),
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.2) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.05'%3E%3Cpolygon fill='%23ffffff' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")
          `,
          color: semanticColors.textInverse,
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
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

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Chip
                  label="🔐 Secure & Reliable"
                  sx={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: semanticColors.textInverse,
                    fontWeight: 600,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    animation: 'fadeInDown 0.6s ease-out'
                  }}
                />

                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.75rem', md: '4rem', lg: '4.5rem' },
                    lineHeight: 1.1,
                    mb: 2,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'fadeInUp 0.8s ease-out',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
                      px: 5,
                      py: 2,
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      color: semanticColors.textInverse,
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      },
                      '&:active': {
                        transform: 'translateY(-2px) scale(1)'
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
                        px: 5,
                        py: 2,
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: semanticColors.textInverse,
                        border: '2px solid rgba(255, 255, 255, 0.5)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        textTransform: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.8)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
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
                    width: { xs: 300, md: 450 },
                    height: { xs: 300, md: 450 },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    fontSize: { xs: '7rem', md: '10rem' },
                    animation: 'float 6s ease-in-out infinite, rotate 20s linear infinite',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '120%',
                      height: '120%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                      animation: 'pulse 3s ease-in-out infinite'
                    }
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
                  p: 4,
                  bgcolor: semanticColors.surface,
                  border: `1px solid ${semanticColors.border}`,
                  borderRadius: '16px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${semanticColors.primary}, ${semanticColors.secondary})`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.4s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
                    borderColor: semanticColors.primary,
                    '&::before': {
                      transform: 'scaleX(1)'
                    },
                    '& .feature-icon': {
                      transform: 'scale(1.1) rotate(5deg)'
                    }
                  }
                }}
              >
                <CardContent>
                  <Box 
                    sx={{ 
                      mb: 3,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(20, 184, 166, 0.1) 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    className="feature-icon"
                  >
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
      <Box sx={{ 
        bgcolor: semanticColors.surface, 
        py: { xs: 8, md: 10 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)'
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.02) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                  }
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  99.9%
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: semanticColors.textMuted,
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  Accuracy Rate
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)',
                  border: '1px solid rgba(34, 197, 94, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.15)',
                    borderColor: 'rgba(34, 197, 94, 0.3)'
                  }
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  &lt; 2s
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: semanticColors.textMuted,
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  Average Response Time
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(20, 184, 166, 0.02) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)',
                    borderColor: 'rgba(59, 130, 246, 0.3)'
                  }
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #3b82f6, #14b8a6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  10K+
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: semanticColors.textMuted,
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  Verifications Daily
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center',
                  p: 3,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%)',
                  border: '1px solid rgba(245, 158, 11, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
                    borderColor: 'rgba(245, 158, 11, 0.3)'
                  }
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  24/7
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: semanticColors.textMuted,
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
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
