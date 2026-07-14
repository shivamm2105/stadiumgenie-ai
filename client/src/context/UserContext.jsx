import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Support switching roles easily for demo evaluation: 'fan', 'organizer', 'volunteer', 'staff'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('sg_user_role') || 'fan';
  });

  const [userName, setUserName] = useState('');

  useEffect(() => {
    localStorage.setItem('sg_user_role', role);
    switch (role) {
      case 'fan':
        setUserName('Fan Assistant');
        break;
      case 'organizer':
        setUserName('Director of Security');
        break;
      case 'volunteer':
        setUserName('Volunteer Translator');
        break;
      case 'staff':
        setUserName('Facilities Officer');
        break;
      default:
        setUserName('Guest');
    }
  }, [role]);

  return (
    <UserContext.Provider value={{ role, setRole, userName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
