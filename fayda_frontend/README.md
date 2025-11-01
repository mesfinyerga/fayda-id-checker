# Fayda ID Checker Frontend

A React-based frontend for the Fayda ID Checker application with multi-tenant support.

## Features

- **React 19** with Vite for fast development
- **Material-UI** for modern, responsive design
- **JWT Authentication** with automatic token handling
- **Multi-tenant Support** (optional tenant switching for admins)
- **Responsive Design** with Tailwind CSS
- **Internationalization** with i18next
- **PDF Generation** with jsPDF
- **Excel Export** with xlsx

## Quick Start

### Prerequisites

- Node.js 18+ 
- Backend running on `http://localhost:8000`

### 1. Install Dependencies

```bash
cd fayda_frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# Optional: Custom API URL for production
# VITE_API_URL=https://your-api-domain.com
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Forms/          # Form components
│   └── UI/             # Generic UI components
├── context/            # React contexts
│   └── AuthContext.jsx # Authentication state management
├── pages/              # Page components
│   ├── Admin/          # Admin pages
│   ├── Auth/           # Authentication pages
│   └── User/           # User pages
├── utils/              # Utility functions
│   ├── api.js          # API client configuration
│   └── jwt.js          # JWT utilities
└── assets/             # Static assets
```

## Authentication Flow

The frontend uses JWT tokens for authentication:

1. **Login**: User credentials → JWT token stored in localStorage
2. **API Calls**: Token automatically included in Authorization header
3. **Token Refresh**: Handled automatically by the API client
4. **Logout**: Token removed from localStorage

## Multi-Tenant Features

### Current Support
- ✅ **Automatic Tenant Context**: Backend handles tenant isolation
- ✅ **User Association**: Users are automatically associated with tenants
- ✅ **Data Isolation**: All data is automatically filtered by tenant

### Optional Features
- 🔄 **Tenant Selector**: Admin users can switch between tenants
- 🔄 **Tenant Management**: Create/manage tenants (admin only)

### Using Tenant Features

```jsx
import { useAuth } from '../context/AuthContext';
import TenantSelector from '../components/TenantSelector';

function Dashboard() {
  const { tenant, user } = useAuth();
  
  return (
    <div>
      {/* Show current tenant info */}
      {tenant && (
        <div>Current Tenant: {tenant.name}</div>
      )}
      
      {/* Optional: Tenant selector for admins */}
      <TenantSelector onTenantChange={(tenantId) => {
        // Handle tenant switching
        console.log('Switched to tenant:', tenantId);
      }} />
    </div>
  );
}
```

## API Integration

The frontend communicates with the backend through the `api.js` utility:

```jsx
import api from '../utils/api';

// Example API calls
const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

const getProfile = async () => {
  const response = await api.get('/me');
  return response.data;
};
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development

### Adding New Components

1. Create component in `src/components/`
2. Use Material-UI for styling
3. Follow existing patterns for props and state management

### Adding New Pages

1. Create page in `src/pages/`
2. Add route in `App.jsx`
3. Use `useAuth()` hook for authentication checks

### API Integration

1. Use the `api` utility from `src/utils/api.js`
2. Handle errors gracefully
3. Use loading states for better UX

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend is running on `http://localhost:8000`
   - Check `VITE_API_URL` in `.env`

2. **Authentication Issues**
   - Clear localStorage and re-login
   - Check JWT token expiration

3. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check Node.js version (18+ required)

### Development Tips

- Use React DevTools for debugging
- Check Network tab for API calls
- Use Material-UI ThemeProvider for consistent styling

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to Static Hosting

The frontend can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

### Environment Configuration

For production, set the correct `VITE_API_URL`:

```env
VITE_API_URL=https://your-production-api.com
```

## Contributing

1. Follow the existing code structure
2. Use Material-UI components
3. Add proper error handling
4. Test with different user roles
5. Ensure responsive design

## Backend Integration

This frontend is designed to work with the multi-tenant FastAPI backend. Key integration points:

- **Authentication**: JWT tokens with automatic header injection
- **Tenant Context**: Automatic tenant isolation handled by backend
- **API Endpoints**: All existing endpoints remain compatible
- **Error Handling**: Consistent error response format

The frontend will work seamlessly with the updated multi-tenant backend without requiring changes to existing functionality.
