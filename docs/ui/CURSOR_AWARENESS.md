# Cursor Awareness - Frontend Architecture

## Quick Overview

**Framework**: React 19.1.0 + Vite 6.3.5  
**UI Library**: Material-UI 7.1.0 + Tailwind CSS 4.1.6  
**Routing**: React Router DOM 7.6.0  
**State**: React Context API (AuthContext)  
**Styling**: MUI sx prop + Tailwind utilities (hybrid approach)  
**I18n**: i18next + react-i18next (configured but not fully implemented)  

## Key Directories

```
fayda_frontend/src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components (planned)
│   ├── layout/         # Layout components (planned)
│   └── ui/             # Base UI components (planned)
├── pages/              # Page-level components
├── context/            # React Context providers
├── utils/              # Utility functions
├── theme/              # Design tokens & MUI theme (planned)
├── hooks/              # Custom React hooks (planned)
├── services/           # API services (planned)
└── __tests__/          # Test files
```

## Current Architecture

### State Management
- **AuthContext**: Handles authentication state, user profile, and API calls
- **Local Storage**: Token and role persistence
- **No Global State**: Currently using local component state

### Styling Approach
- **MUI Components**: Primary UI components (Button, TextField, etc.)
- **Tailwind Utilities**: Fine-grained styling and responsive design
- **Mixed Approach**: Some hardcoded colors, inconsistent spacing

### Routing
- **Client-side**: React Router with protected routes
- **Role-based**: Admin vs User routing
- **No Code Splitting**: All routes loaded upfront

## Development Guidelines

### ✅ Do's

#### Component Development
```jsx
// ✅ Use MUI components with consistent props
<Button
  variant="contained"
  color="primary"
  size="medium"
  sx={{ borderRadius: 2, textTransform: 'none' }}
>
  Button Text
</Button>

// ✅ Use Tailwind for fine-grained control
<Box className="flex items-center gap-4 p-6">
  <Typography variant="h6">Title</Typography>
</Box>

// ✅ Follow naming conventions
// Components: PascalCase (UserProfile.jsx)
// Files: kebab-case (user-profile.jsx)
// Functions: camelCase (handleUserUpdate)
```

#### Styling
```jsx
// ✅ Use design tokens (when implemented)
sx={{ 
  backgroundColor: 'primary.main',
  borderRadius: 2,
  p: 3 
}}

// ✅ Combine MUI and Tailwind appropriately
<Card sx={{ borderRadius: 3 }} className="shadow-lg hover:shadow-xl">
  <CardContent className="p-6">
    <Typography variant="h6" className="mb-4">Content</Typography>
  </CardContent>
</Card>
```

#### State Management
```jsx
// ✅ Use AuthContext for auth-related state
const { token, user, login, logout } = useAuth();

// ✅ Use local state for component-specific data
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
```

### ❌ Don'ts

#### Avoid These Patterns
```jsx
// ❌ Don't hardcode colors
sx={{ backgroundColor: '#1976d2' }}

// ❌ Don't mix styling approaches inconsistently
sx={{ marginBottom: '16px' }}  // Use MUI spacing instead
className="mb-4"               // Or use Tailwind consistently

// ❌ Don't create components without proper structure
function MyComponent() {
  // Missing proper component structure
}

// ❌ Don't ignore accessibility
<button onClick={handleClick}>Click me</button>  // Missing ARIA labels
```

## File Conventions

### Component Structure
```jsx
// ✅ Standard component structure
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. Hooks
  const { token } = useAuth();
  const [state, setState] = useState(null);

  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 3. Handlers
  const handleAction = () => {
    // Handler logic
  };

  // 4. Render
  return (
    <Box>
      <Typography variant="h6">Title</Typography>
      <Button onClick={handleAction}>Action</Button>
    </Box>
  );
};

export default ComponentName;
```

### Import Order
```jsx
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// 3. Local imports
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
```

## Adding New Components

### 1. Create Component File
```bash
# Create component file
touch src/components/NewComponent.jsx

# Create test file
touch src/__tests__/NewComponent.test.jsx
```

### 2. Component Template
```jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const NewComponent = ({ children, ...props }) => {
  return (
    <Box {...props}>
      <Typography variant="h6">New Component</Typography>
      {children}
    </Box>
  );
};

export default NewComponent;
```

### 3. Add to Index (if needed)
```jsx
// src/components/index.js
export { default as NewComponent } from './NewComponent';
```

## Adding New Pages

### 1. Create Page File
```bash
touch src/pages/NewPage.jsx
```

### 2. Add Route
```jsx
// src/App.jsx
import NewPage from './pages/NewPage';

// In Routes
<Route path="/new-page" element={<NewPage />} />
```

### 3. Add Navigation (if needed)
```jsx
// src/components/Navbar.jsx
<Button component={Link} to="/new-page">
  New Page
</Button>
```

## Testing Guidelines

### Component Testing
```jsx
// src/__tests__/ComponentName.test.jsx
import { render, screen } from '@testing-library/react';
import ComponentName from '../components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Run Tests
```bash
npm test
npm run test:watch
```

## Performance Guidelines

### Code Splitting
```jsx
// ✅ Lazy load routes (when implemented)
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// ✅ Lazy load heavy components
const PaymentHistory = lazy(() => import('./components/PaymentHistory'));
```

### Memoization
```jsx
// ✅ Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data.map(item => <Item key={item.id} {...item} />)}</div>;
});

// ✅ Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return data.filter(item => item.active).map(item => item.name);
}, [data]);
```

## Accessibility Guidelines

### ARIA Labels
```jsx
// ✅ Always add ARIA labels
<IconButton aria-label="Delete user">
  <DeleteIcon />
</IconButton>

// ✅ Associate form labels
<TextField
  label="Email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
```

### Keyboard Navigation
```jsx
// ✅ Support keyboard navigation
<Button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</Button>
```

## Common Patterns

### API Calls
```jsx
// ✅ Use the api utility
import api from '../utils/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

### Form Handling
```jsx
// ✅ Standard form pattern
const [formData, setFormData] = useState({});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    await api.post('/endpoint', formData);
    // Success handling
  } catch (err) {
    setError('Error message');
  } finally {
    setLoading(false);
  }
};
```

### Loading States
```jsx
// ✅ Consistent loading pattern
{loading ? (
  <CircularProgress />
) : (
  <div>Content</div>
)}
```

## Environment Setup

### Development
```bash
cd fayda_frontend
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Key Files to Know

- `src/App.jsx` - Main routing and layout
- `src/context/AuthContext.jsx` - Authentication state
- `src/utils/api.js` - API configuration
- `src/components/Navbar.jsx` - Main navigation
- `tailwind.config.js` - Tailwind configuration
- `vite.config.js` - Build configuration

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Install new dependency
npm install package-name

# Add dev dependency
npm install --save-dev package-name
```

---

*Cursor Awareness v1.0 - Last updated: 2024-12-19*
