import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

/**
 * ZORVYN AUTHENTICATION PROVIDER
 * Manages identity and session tokens across the Finance App.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(localStorage.getItem("token"));

  // Effect to handle session persistence and potential multi-tab sync
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  /**
   * login - Securely sets the user profile and JWT
   */
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  /**
   * logout - Immediate session termination
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // We use removeItem instead of clear() to avoid nuking
    // other local settings like 'theme' or 'preferences'
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
