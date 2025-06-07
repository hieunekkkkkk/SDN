// contexts/UserRoleContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const setRole = (newRole) => {
    localStorage.setItem('userRole', newRole);
    setRoleState(newRole);
  };

  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
