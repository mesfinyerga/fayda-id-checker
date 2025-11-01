import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TenantSelector = ({ onTenantChange }) => {
  const { tenant } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available tenants (for admin users)
  useEffect(() => {
    const fetchTenants = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Failed to fetch tenants:', error);
        // If not admin, just show current tenant
        if (tenant) {
          setTenants([tenant]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [tenant]);

  const handleTenantChange = (event) => {
    const selectedTenant = event.target.value;
    if (onTenantChange) {
      onTenantChange(selectedTenant);
    }
  };

  // If user is not admin or no tenant switching needed, don't render
  if (!tenant || tenants.length <= 1) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Current Tenant
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip 
          label={tenant.name || 'Default'} 
          color="primary" 
          variant="outlined"
          size="small"
        />
        {tenants.length > 1 && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Switch Tenant</InputLabel>
            <Select
              value={tenant.id || ''}
              label="Switch Tenant"
              onChange={handleTenantChange}
              disabled={loading}
            >
              {tenants.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} ({t.status})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
    </Box>
  );
};

export default TenantSelector;
