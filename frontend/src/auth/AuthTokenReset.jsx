import { useEffect } from 'react';

const AuthTokenReset = () => {
  useEffect(() => {
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userRole'); 
  }, []);

  return null;
};

export default AuthTokenReset;