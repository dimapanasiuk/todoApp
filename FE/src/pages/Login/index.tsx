import * as React from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Link
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore'; 
import Loader from '@/components/Loader';

function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  
  const { 
    isLoggingIn, 
    error, 
    success, 
    login, 
    clearError, 
    clearSuccess 
  } = useAuthStore();

  const loading = isLoggingIn;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    clearError();
    clearSuccess();
    
    const success = await login(email, password);
    if (success) {
      navigate('/board');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Вход
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
                {success}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Адрес электронной почты"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/registration" variant="body2">
                  Нет аккаунта? Зарегистрироваться
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {loading && (
        <Loader 
          type="backdrop" 
          loading={true} 
          message="Выполняется вход..." 
        />
      )}
    </Container>
  );
}

export default Login;