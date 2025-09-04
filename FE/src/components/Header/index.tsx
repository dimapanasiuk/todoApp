import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  CircularProgress
} from '@mui/material';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const { logout, isLoggingOut, user } = useAuthStore();
  const loading = isLoggingOut;

  return (
    <AppBar position="static" sx={{ marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Todo App
        </Typography>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="inherit">
              {user.email}
            </Typography>
            <Button 
              color="inherit" 
              onClick={logout}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Выход...' : 'Выход'}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}