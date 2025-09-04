import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import api from '../../api/api';

const handleLogout = async () => {
  const token = localStorage.getItem('refreshToken') || '';
  localStorage.setItem('accessToken', '');

  await api.logout(token)
};

export function Header() {
  return (
    <AppBar position="static"  sx={{marginBottom: '20px' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My keeps
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Exit
        </Button>
      </Toolbar>
    </AppBar>
  );
}