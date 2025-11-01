import React from 'react';
import { Typography as MuiTypography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { 
  typographyVariants, 
  responsiveTypography, 
  getTypographyVariant,
  getResponsiveTypography,
  typographyMixins 
} from '../theme/typography';

// Base Typography component with enhanced functionality
const Typography = ({
  variant = 'body1',
  component,
  children,
  responsive = false,
  color,
  align,
  weight,
  transform,
  decoration,
  lineHeight,
  letterSpacing,
  gutterBottom = false,
  noWrap = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get responsive variant if enabled
  const getVariant = () => {
    if (!responsive) return variant;
    
    const responsiveVariant = responsiveTypography[variant];
    if (!responsiveVariant) return variant;

    if (isMobile) return responsiveVariant.xs || variant;
    if (isTablet) return responsiveVariant.sm || variant;
    return responsiveVariant.md || variant;
  };

  // Build custom styles
  const customStyles = {
    ...getTypographyVariant(getVariant()),
    ...(color && { color }),
    ...(align && { textAlign: align }),
    ...(weight && { fontWeight: weight }),
    ...(transform && { textTransform: transform }),
    ...(decoration && { textDecoration: decoration }),
    ...(lineHeight && { lineHeight }),
    ...(letterSpacing && { letterSpacing }),
    ...(gutterBottom && { marginBottom: theme.spacing(1) }),
    ...sx
  };

  return (
    <MuiTypography
      variant={getVariant()}
      component={component}
      noWrap={noWrap}
      sx={customStyles}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

// Display Typography components
const Display1 = (props) => <Typography variant="display1" component="h1" {...props} />;
const Display2 = (props) => <Typography variant="display2" component="h1" {...props} />;
const Display3 = (props) => <Typography variant="display3" component="h1" {...props} />;

// Heading components
const H1 = (props) => <Typography variant="h1" component="h1" responsive {...props} />;
const H2 = (props) => <Typography variant="h2" component="h2" responsive {...props} />;
const H3 = (props) => <Typography variant="h3" component="h3" responsive {...props} />;
const H4 = (props) => <Typography variant="h4" component="h4" responsive {...props} />;
const H5 = (props) => <Typography variant="h5" component="h5" responsive {...props} />;
const H6 = (props) => <Typography variant="h6" component="h6" responsive {...props} />;

// Body text components
const Body1 = (props) => <Typography variant="body1" component="p" {...props} />;
const Body2 = (props) => <Typography variant="body2" component="p" {...props} />;

// Caption and small text components
const Caption = (props) => <Typography variant="caption" component="span" {...props} />;
const Overline = (props) => <Typography variant="overline" component="span" {...props} />;

// Subtitle components
const Subtitle1 = (props) => <Typography variant="subtitle1" component="p" {...props} />;
const Subtitle2 = (props) => <Typography variant="subtitle2" component="p" {...props} />;

// Button text component
const ButtonText = (props) => <Typography variant="button" component="span" {...props} />;

// Specialized text components
const Link = ({ href, children, ...props }) => (
  <Typography
    variant="body1"
    component="a"
    href={href}
    sx={{
      color: 'primary.main',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    }}
    {...props}
  >
    {children}
  </Typography>
);

const ErrorText = (props) => (
  <Typography
    variant="body2"
    component="span"
    color="error.main"
    {...props}
  />
);

const SuccessText = (props) => (
  <Typography
    variant="body2"
    component="span"
    color="success.main"
    {...props}
  />
);

const WarningText = (props) => (
  <Typography
    variant="body2"
    component="span"
    color="warning.main"
    {...props}
  />
);

const InfoText = (props) => (
  <Typography
    variant="body2"
    component="span"
    color="info.main"
    {...props}
  />
);

const SecondaryText = (props) => (
  <Typography
    variant="body2"
    component="span"
    color="text.secondary"
    {...props}
  />
);

// Text utility components
const Text = {
  // Display variants
  Display1,
  Display2,
  Display3,
  
  // Heading variants
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  
  // Body variants
  Body1,
  Body2,
  
  // Caption variants
  Caption,
  Overline,
  
  // Subtitle variants
  Subtitle1,
  Subtitle2,
  
  // Button text
  ButtonText,
  
  // Specialized variants
  Link,
  ErrorText,
  SuccessText,
  WarningText,
  InfoText,
  SecondaryText,
  
  // Base component
  Typography
};

// Typography utility functions
export const createTypographyVariant = (variant, customProps = {}) => {
  return (props) => <Typography variant={variant} {...customProps} {...props} />;
};

export const withTypography = (Component, typographyProps = {}) => {
  return (props) => (
    <Typography {...typographyProps} {...props}>
      <Component {...props} />
    </Typography>
  );
};

// Responsive text component
const ResponsiveText = ({ 
  variant = 'body1',
  mobileVariant,
  tabletVariant,
  desktopVariant,
  children,
  ...props 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getResponsiveVariant = () => {
    if (isMobile && mobileVariant) return mobileVariant;
    if (isTablet && tabletVariant) return tabletVariant;
    if (desktopVariant) return desktopVariant;
    return variant;
  };

  return (
    <Typography variant={getResponsiveVariant()} {...props}>
      {children}
    </Typography>
  );
};

// Text group component for consistent spacing
const TextGroup = ({ 
  children, 
  spacing = 1, 
  align = 'left',
  sx = {},
  ...props 
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(spacing),
        textAlign: align,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Export all components
export {
  Typography,
  Display1,
  Display2,
  Display3,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body1,
  Body2,
  Caption,
  Overline,
  Subtitle1,
  Subtitle2,
  ButtonText,
  Link,
  ErrorText,
  SuccessText,
  WarningText,
  InfoText,
  SecondaryText,
  ResponsiveText,
  TextGroup,
  Text
};

export default Typography;
