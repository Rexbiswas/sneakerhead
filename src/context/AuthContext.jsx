import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('sneakerhead_token');
      const storedUser = localStorage.getItem('sneakerhead_user');

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);

        // Verify token with backend
        fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Token expired or invalid');
          })
          .then((data) => {
            if (data.success && data.user) {
              setUser(data.user);
              localStorage.setItem('sneakerhead_user', JSON.stringify(data.user));
            }
          })
          .catch(() => {
            // Token is invalid/expired -> clear state
            localStorage.removeItem('sneakerhead_token');
            localStorage.removeItem('sneakerhead_user');
            setUser(null);
            setToken(null);
          });
      }
    } catch (e) {
      console.error('Error restoring auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          alreadyExists: data.alreadyExists || false,
          message: data.message || 'Signup failed. Please try again.'
        };
      }

      // Save credentials & log user in
      localStorage.setItem('sneakerhead_token', data.token);
      localStorage.setItem('sneakerhead_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        message: data.message,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Could not connect to backend server. Please verify the server is running.'
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Login failed. Please check your credentials.'
        };
      }

      // Save credentials & log user in
      localStorage.setItem('sneakerhead_token', data.token);
      localStorage.setItem('sneakerhead_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        message: data.message,
        user: data.user
      };
    } catch (error) {
      return {
        success: false,
        message: 'Could not connect to backend server. Please verify the server is running.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('sneakerhead_token');
    localStorage.removeItem('sneakerhead_user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
