import React from 'react';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Backdrop,
  LinearProgress
} from '@mui/material';

interface LoaderProps {
  loading?: boolean;
  message?: string;
  type?: 'circular' | 'linear' | 'backdrop';
  size?: number;
  color?: 'primary' | 'secondary' | 'inherit';
}

const Loader: React.FC<LoaderProps> = ({
  loading = true,
  message,
  type = 'circular',
  size = 40,
  color = 'primary'
}) => {
  if (!loading) return null;

  const renderLoader = () => {
    switch (type) {
      case 'backdrop':
        return (
          <Backdrop
            sx={{ 
              color: '#fff', 
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
            open={loading}
          >
            <CircularProgress color={color} size={size} />
            {message && (
              <Typography variant="h6" color="inherit">
                {message}
              </Typography>
            )}
          </Backdrop>
        );

      case 'linear':
        return (
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress color={color} />
            {message && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {message}
              </Typography>
            )}
          </Box>
        );

      case 'circular':
      default:
        return (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              py: 4
            }}
          >
            <CircularProgress color={color} size={size} />
            {message && (
              <Typography variant="body1" color="text.secondary">
                {message}
              </Typography>
            )}
          </Box>
        );
    }
  };

  return renderLoader();
};

export default Loader;
