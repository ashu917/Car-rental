import { useAppContext } from '../Components/Context/AppContext';
import { toast } from 'react-hot-toast';

export const useAuth = () => {
  const { token, user } = useAppContext();

  const requireAuth = (action, redirectTo = null) => {
    if (!token || !user) {
      toast.error('Please login to continue', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          fontSize: '14px',
        },
      });
      return false;
    }
    return true;
  };

  const isAuthenticated = () => {
    return !!(token && user);
  };

  return {
    requireAuth,
    isAuthenticated,
    token,
    user
  };
};
