import React, { useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { PuffLoader } from 'react-spinners';

const AuthCallback = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      if (isSignedIn && user) {
        try {
          const clerkToken = await getToken({ template: 'node-backend' });

          if (!clerkToken) throw new Error("Không lấy được token từ Clerk");

          const response = await fetch(`${import.meta.env.VITE_BE_URL}/auth`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${clerkToken}`,
            },
          });

          const data = await response.json();

          if (!response.ok) throw new Error(data.message || 'Lỗi xác thực từ server');

          localStorage.setItem('accessToken', data.accessToken);

          const role = data.claims?.role || user.publicMetadata?.role || 'user';

          switch (role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'business':
              navigate('/business');
              break;
            case 'user':
              navigate('/');
              break;
            default:
              navigate('/');
          }

        } catch (err) {
          console.error('Lỗi xác thực:', err);
          navigate('/error');
        }
      }
    };

    handleAuth();
  }, [isSignedIn, user, getToken, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      <PuffLoader size={90} />
      <p style={{ marginTop: '16px', fontSize: '18px', color: '#333' }}>Đang đăng nhập...</p>
    </div>
  );
};

export default AuthCallback;
