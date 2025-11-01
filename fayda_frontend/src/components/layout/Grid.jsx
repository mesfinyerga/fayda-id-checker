import React from 'react';
import { Box, Grid as MuiGrid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const Grid = ({
  children,
  container = false,
  item = false,
  spacing = 2,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Convert columns object to MUI Grid props
  const getGridProps = () => {
    if (!container) return {};
    
    return {
      xs: columns.xs || 12,
      sm: columns.sm || 6,
      md: columns.md || 4,
      lg: columns.lg || 3,
      xl: columns.xl || 2
    };
  };

  return (
    <MuiGrid
      container={container}
      item={item}
      spacing={spacing}
      {...getGridProps()}
      sx={{
        ...sx
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
};

// Grid Container component
const GridContainer = ({ children, spacing = 2, sx = {}, ...props }) => (
  <Grid container spacing={spacing} sx={sx} {...props}>
    {children}
  </Grid>
);

// Grid Item component
const GridItem = ({ children, columns, sx = {}, ...props }) => (
  <Grid item columns={columns} sx={sx} {...props}>
    {children}
  </Grid>
);

// Responsive Grid components
const ResponsiveGrid = ({ children, sx = {}, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getResponsiveColumns = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { sm: 6 };
    return { md: 4, lg: 3 };
  };

  return (
    <GridContainer
      spacing={2}
      columns={getResponsiveColumns()}
      sx={sx}
      {...props}
    >
      {children}
    </GridContainer>
  );
};

// Auto-fit Grid component
const AutoFitGrid = ({ 
  children, 
  minWidth = 300, 
  spacing = 2, 
  sx = {}, 
  ...props 
}) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
      gap: theme => theme.spacing(spacing),
      ...sx
    }}
    {...props}
  >
    {children}
  </Box>
);

// Masonry Grid component
const MasonryGrid = ({ children, columns = 3, spacing = 2, sx = {}, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getColumnCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return columns;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)`,
        gap: theme.spacing(spacing),
        gridAutoRows: '0',
        gridTemplateRows: 'masonry',
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

// Export components
Grid.Container = GridContainer;
Grid.Item = GridItem;
Grid.Responsive = ResponsiveGrid;
Grid.AutoFit = AutoFitGrid;
Grid.Masonry = MasonryGrid;

export default Grid;
