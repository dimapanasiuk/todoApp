import { useEffect } from 'react';
import AppRoutes from '@/router';
import { useAuthStore } from '@/store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRoutes/>
    </>
  );
}

export default App;
