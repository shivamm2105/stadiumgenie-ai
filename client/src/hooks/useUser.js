import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

/**
 * Custom hook to retrieve current User Context details (user role, name, and setter).
 * @returns {object} User state context containing:
 * - role: string ('fan', 'organizer', 'volunteer', 'staff')
 * - setRole: function
 * - userName: string
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
