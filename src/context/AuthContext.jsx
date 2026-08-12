import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nd2_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // Default to Student role for realistic first-time view
    return MOCK_USERS.student;
  });

  const [role, setRole] = useState(currentUser?.role || 'student');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('nd2_current_user', JSON.stringify(currentUser));
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const switchRole = (newRole) => {
    if (MOCK_USERS[newRole]) {
      const user = MOCK_USERS[newRole];
      setCurrentUser(user);
      setRole(newRole);
      return user;
    }
    return currentUser;
  };

  const login = (roleKey, customData = {}) => {
    const baseUser = MOCK_USERS[roleKey] || MOCK_USERS.student;
    const user = { ...baseUser, ...customData };
    setCurrentUser(user);
    setRole(user.role);
    return user;
  };

  const logout = () => {
    // For demo purposes, we can redirect or reset to student
    localStorage.removeItem('nd2_current_user');
    setCurrentUser(null);
    setRole('guest');
  };

  const updateUserProfile = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated: !!currentUser,
        switchRole,
        login,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
