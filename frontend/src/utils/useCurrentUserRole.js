import { jwtDecode } from 'jwt-decode';

export const getCurrentUserRole = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log('Decoded JWT:', decoded);
    console.log('User role:', decoded.role);
    return decoded.role;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
