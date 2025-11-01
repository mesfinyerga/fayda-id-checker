# Performance Playbook

## Overview

This playbook provides performance optimization strategies and best practices for the Fayda ID Checker application. It covers bundle optimization, rendering performance, and monitoring strategies.

## Performance Metrics

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms
- **FCP (First Contentful Paint)**: < 1.8s

### Application-Specific Metrics
- **Bundle Size**: < 500KB (gzipped)
- **Initial Load Time**: < 3s on 3G
- **Time to Interactive**: < 5s
- **Memory Usage**: < 50MB baseline
- **API Response Time**: < 200ms average

## Bundle Optimization

### Code Splitting Strategy

#### Route-Based Splitting
```jsx
// ✅ Good - Lazy load routes
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Payment = lazy(() => import('./pages/Payment'));

// App.jsx
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<AdminDashboard />} />
    <Route path="/user" element={<UserDashboard />} />
    <Route path="/payment" element={<Payment />} />
  </Routes>
</Suspense>
```

#### Component-Based Splitting
```jsx
// ✅ Good - Lazy load heavy components
const PaymentHistory = lazy(() => import('./components/PaymentHistory'));
const RegisterClientModal = lazy(() => import('./components/RegisterClientModal'));

// Only load when needed
{showPaymentHistory && (
  <Suspense fallback={<TableSkeleton />}>
    <PaymentHistory />
  </Suspense>
)}
```

### Tree Shaking Configuration

#### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          utils: ['axios', 'i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

#### MUI Optimization
```jsx
// ✅ Good - Import specific components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

// ❌ Avoid - Import entire library
import { Button, TextField } from '@mui/material';
```

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'bundle-analysis.html',
      open: true
    })
  ]
});
```

## Rendering Performance

### React Optimization

#### Memoization Strategy
```jsx
// ✅ Good - Memoize expensive components
const ExpensiveTable = React.memo(({ data, filters }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => 
      filters.status ? item.status === filters.status : true
    );
  }, [data, filters.status]);

  return (
    <Table>
      {filteredData.map(item => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
});

// ✅ Good - Memoize callbacks
const handleUserUpdate = useCallback((userId, updates) => {
  updateUser(userId, updates);
}, [updateUser]);
```

#### Virtual Scrolling for Large Lists
```jsx
// For tables with > 100 rows
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TableRow>
        <TableCell>{items[index].name}</TableCell>
        <TableCell>{items[index].email}</TableCell>
      </TableRow>
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </List>
  );
};
```

### MUI Performance Optimization

#### Theme Optimization
```jsx
// ✅ Good - Create theme once
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// App.jsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

#### Component Optimization
```jsx
// ✅ Good - Use sx prop for dynamic styles
<Box sx={{ 
  display: 'flex', 
  gap: 2,
  backgroundColor: isActive ? 'primary.main' : 'transparent'
}} />

// ❌ Avoid - Inline styles
<Box style={{ 
  display: 'flex', 
  gap: '16px',
  backgroundColor: isActive ? '#1976d2' : 'transparent'
}} />
```

## Image Optimization

### Image Strategy
```jsx
// ✅ Good - Responsive images
<img
  srcSet={`
    ${imageUrl}?w=300 300w,
    ${imageUrl}?w=600 600w,
    ${imageUrl}?w=900 900w
  `}
  sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 900px"
  src={imageUrl}
  alt="User avatar"
  loading="lazy"
/>

// ✅ Good - Avatar optimization
<Avatar
  src={user.avatar_url}
  alt={`${user.name} avatar`}
  sx={{
    width: { xs: 32, sm: 40, md: 48 },
    height: { xs: 32, sm: 40, md: 48 }
  }}
/>
```

### Image Loading
```jsx
// ✅ Good - Lazy loading with skeleton
const [imageLoaded, setImageLoaded] = useState(false);

<img
  src={imageUrl}
  alt="Content"
  onLoad={() => setImageLoaded(true)}
  style={{ display: imageLoaded ? 'block' : 'none' }}
/>
{!imageLoaded && <Skeleton variant="rectangular" width={200} height={150} />}
```

## Font Optimization

### Font Loading Strategy
```css
/* index.css */
@font-face {
  font-family: 'Roboto';
  font-display: swap;
  src: url('/fonts/roboto-regular.woff2') format('woff2');
}

/* Preload critical fonts */
<link rel="preload" href="/fonts/roboto-regular.woff2" as="font" type="font/woff2" crossorigin>
```

### MUI Font Optimization
```jsx
// theme.js
const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});
```

## API Performance

### Caching Strategy
```jsx
// ✅ Good - React Query for API caching
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/admin/users').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => api.patch(`/admin/users/${userData.id}`, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
```

### Request Optimization
```jsx
// ✅ Good - Debounced search
const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedValue;
};

// Usage
const debouncedSearch = useDebouncedSearch(searchTerm);
const { data: searchResults } = useQuery({
  queryKey: ['search', debouncedSearch],
  queryFn: () => api.get(`/search?q=${debouncedSearch}`),
  enabled: debouncedSearch.length > 2,
});
```

## Monitoring & Metrics

### Performance Monitoring Setup
```jsx
// performance.js
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${end - start}ms`);
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', 'performance', {
      event_category: 'timing',
      event_label: name,
      value: Math.round(end - start)
    });
  }
  
  return result;
};

// Usage
const handleSubmit = () => {
  measurePerformance('form-submit', () => {
    // Form submission logic
  });
};
```

### Lighthouse Script
```javascript
// scripts/lighthouse.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse(url, options);
  const reportJson = runnerResult.lhr;

  await chrome.kill();

  return {
    performance: reportJson.categories.performance.score * 100,
    accessibility: reportJson.categories.accessibility.score * 100,
    bestPractices: reportJson.categories['best-practices'].score * 100,
    metrics: reportJson.audits
  };
}

// package.json script
// "lighthouse": "node scripts/lighthouse.js"
```

### Bundle Size Monitoring
```javascript
// scripts/bundle-size.js
const fs = require('fs');
const path = require('path');

function getBundleSize() {
  const distPath = path.join(__dirname, '../dist');
  const files = fs.readdirSync(distPath);
  
  const sizes = files
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024)
      };
    });
  
  console.table(sizes);
  return sizes;
}

// package.json script
// "bundle-size": "node scripts/bundle-size.js"
```

## Optimization Checklist

### Build Optimization
- [ ] **Code Splitting**: Implement route-based and component-based splitting
- [ ] **Tree Shaking**: Configure proper tree shaking for MUI and other libraries
- [ ] **Bundle Analysis**: Set up bundle analyzer to monitor size
- [ ] **Minification**: Ensure proper minification in production builds
- [ ] **Gzip Compression**: Enable gzip compression on server

### Runtime Optimization
- [ ] **Memoization**: Memoize expensive components and calculations
- [ ] **Virtual Scrolling**: Implement for large data sets
- [ ] **Lazy Loading**: Lazy load non-critical components
- [ ] **Image Optimization**: Implement responsive images and lazy loading
- [ ] **Font Optimization**: Optimize font loading and display

### API Optimization
- [ ] **Caching**: Implement React Query for API caching
- [ ] **Debouncing**: Debounce search and filter inputs
- [ ] **Pagination**: Implement proper pagination for large datasets
- [ ] **Request Batching**: Batch multiple API calls where possible
- [ ] **Error Handling**: Implement proper error boundaries

### Monitoring
- [ ] **Performance Metrics**: Set up Core Web Vitals monitoring
- [ ] **Bundle Size**: Monitor bundle size changes
- [ ] **Lighthouse**: Regular Lighthouse audits
- [ ] **Real User Monitoring**: Implement RUM for production metrics
- [ ] **Error Tracking**: Set up error tracking and monitoring

## Performance Budget

### Bundle Size Limits
- **Initial Bundle**: < 300KB (gzipped)
- **Vendor Bundle**: < 200KB (gzipped)
- **Route Bundle**: < 100KB (gzipped)
- **Total Bundle**: < 500KB (gzipped)

### Performance Targets
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 5s

### API Performance
- **TTFB**: < 600ms
- **API Response Time**: < 200ms average
- **Cache Hit Rate**: > 80%
- **Error Rate**: < 1%

## Tools & Resources

### Development Tools
- **React DevTools Profiler**: Component performance analysis
- **Chrome DevTools Performance**: Runtime performance analysis
- **Bundle Analyzer**: Bundle size analysis
- **Lighthouse**: Performance auditing

### Monitoring Tools
- **Google Analytics**: Core Web Vitals tracking
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Application performance monitoring
- **WebPageTest**: Performance testing

### Optimization Libraries
- **React Query**: API caching and state management
- **React Window**: Virtual scrolling for large lists
- **React Virtualized**: Alternative virtual scrolling
- **Workbox**: Service worker and caching

---

*Performance Playbook v1.0 - Last updated: 2024-12-19*
