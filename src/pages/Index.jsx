
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Index = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  return null;
};

export default Index;
