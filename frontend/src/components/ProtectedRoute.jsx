import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isJwtExpired } from '../utils/tokenUtils';
import { useUser, useClerk } from '@clerk/clerk-react';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.locked) {
      signOut();
    }
  }, [isLoaded, user, signOut]);  

  if (!isLoaded) return <><LoadingScreen/></>;

  if (isSignedIn && (!token || isJwtExpired(token))) {
    return <Navigate to="/auth-callback" />;
  }

  return children;
};

export default ProtectedRoute;