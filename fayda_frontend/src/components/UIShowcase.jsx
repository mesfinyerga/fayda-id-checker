import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Avatar,
  Stack,
  Divider,
  Alert,
  IconButton,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Slider,
  Rating,
  LinearProgress,
  CircularProgress,
  Badge,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const UIShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [rating, setRating] = useState(4);
  const [sliderValue, setSliderValue] = useState(50);
  const [switchValue, setSwitchValue] = useState(true);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Enhanced Security',
      description: 'Advanced encryption and secure protocols'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance for instant results'
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Accurate Validation',
      description: 'High-precision verification algorithms'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    }
  ];

  const stats = [
    { label: 'Accuracy Rate', value: '99.9%', color: 'primary.main' },
    { label: 'Response Time', value: '< 2s', color: 'success.main' },
    { label: 'Daily Verifications', value: '10K+', color: 'info.main' },
    { label: 'Uptime', value: '99.99%', color: 'warning.main' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ 
        fontWeight: 700, 
        textAlign: 'center',
        mb: 6,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Enhanced UI Showcase
      </Typography>

      <Typography variant="h6" sx={{ 
        textAlign: 'center', 
        color: 'text.secondary',
        mb: 8,
        maxWidth: 600,
        mx: 'auto'
      }}>
        Experience the modern, polished interface with enhanced design tokens, 
        smooth animations, and improved user experience
      </Typography>

      {/* Hero Section */}
      <Paper elevation={0} sx={{ 
        p: 6, 
        mb: 6, 
        borderRadius: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }}
        />
        
        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Chip 
                label="✨ Modern Design" 
                sx={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600
                }} 
              />
              
              <Typography variant="h2" sx={{ 
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3rem' },
                lineHeight: 1.2
              }}>
                Beautiful & Functional
              </Typography>
              
              <Typography variant="h6" sx={{ 
                opacity: 0.9,
                lineHeight: 1.6
              }}>
                Discover the enhanced user interface with modern gradients, 
                smooth animations, and improved visual hierarchy.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Explore Features
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: { xs: 250, md: 300 },
                  height: { xs: 250, md: 300 },
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '6rem',
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                ✨
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Fade in timeout={1000 + index * 200}>
              <Card sx={{ 
                height: '100%',
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }
              }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary'
                  }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'text.secondary',
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Stats Section */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 6, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid',
        borderColor: 'neutral.200'
      }}>
        <Typography variant="h5" sx={{ 
          textAlign: 'center', 
          mb: 4,
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Performance Metrics
        </Typography>
        
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 700,
                    color: stat.color,
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Interactive Components */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 6, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid',
        borderColor: 'neutral.200'
      }}>
        <Typography variant="h5" sx={{ 
          mb: 4,
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Interactive Components
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                label="Enhanced Input Field"
                placeholder="Type something..."
                fullWidth
                variant="outlined"
              />
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rating: {rating}/5
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Progress: {sliderValue}%
                </Typography>
                <Slider
                  value={sliderValue}
                  onChange={(event, newValue) => setSliderValue(newValue)}
                  aria-label="Progress"
                />
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={switchValue}
                    onChange={(event) => setSwitchValue(event.target.checked)}
                  />
                }
                label="Enhanced Switch"
              />
            </Stack>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Primary" color="primary" />
                <Chip label="Success" color="success" />
                <Chip label="Warning" color="warning" />
                <Chip label="Error" color="error" />
                <Chip label="Info" color="info" />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Badge badgeContent={4} color="primary">
                  <Avatar>U</Avatar>
                </Badge>
                <Badge badgeContent={99} color="error">
                  <Avatar>N</Avatar>
                </Badge>
                <Badge badgeContent={0} color="success">
                  <Avatar>I</Avatar>
                </Badge>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CircularProgress size={40} />
                <LinearProgress sx={{ flex: 1, alignSelf: 'center' }} />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Enhanced Tooltip">
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                <IconButton>
                  <FavoriteIcon />
                </IconButton>
                <IconButton>
                  <ShareIcon />
                </IconButton>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Alerts Section */}
      <Paper elevation={0} sx={{ 
        p: 4, 
        mb: 6, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid',
        borderColor: 'neutral.200'
      }}>
        <Typography variant="h5" sx={{ 
          mb: 4,
          fontWeight: 600,
          color: 'text.primary'
        }}>
          Enhanced Alerts
        </Typography>
        
        <Stack spacing={2}>
          <Alert severity="success" icon={<CheckCircleIcon />}>
            This is a success alert with enhanced styling and icons!
          </Alert>
          <Alert severity="error" icon={<ErrorIcon />}>
            This is an error alert with enhanced styling and icons!
          </Alert>
          <Alert severity="warning" icon={<WarningIcon />}>
            This is a warning alert with enhanced styling and icons!
          </Alert>
          <Alert severity="info" icon={<InfoIcon />}>
            This is an info alert with enhanced styling and icons!
          </Alert>
        </Stack>
      </Paper>

      {/* Tabs Section */}
      <Paper elevation={0} sx={{ 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid',
        borderColor: 'neutral.200'
      }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ 
          borderBottom: 1, 
          borderColor: 'neutral.300',
          px: 3,
          pt: 2
        }}>
          <Tab label="Overview" />
          <Tab label="Features" />
          <Tab label="Analytics" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Typography>
              Welcome to the enhanced UI showcase. This demonstrates the modern design system with improved components.
            </Typography>
          )}
          {activeTab === 1 && (
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <StarIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Modern Design System" 
                  secondary="Enhanced colors, typography, and spacing"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Improved Performance" 
                  secondary="Optimized animations and transitions"
                />
              </ListItem>
            </List>
          )}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Usage Statistics</Typography>
              <LinearProgress variant="determinate" value={75} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                75% of users prefer the enhanced interface
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

    </Container>
  );
};

export default UIShowcase;
