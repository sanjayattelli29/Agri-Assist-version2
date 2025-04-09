
import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const defaultAdminAuthContext: AdminAuthContextType = {
  isAdminAuthenticated: false,
  login: () => false,
  logout: () => {},
};

const AdminAuthContext = createContext<AdminAuthContextType>(defaultAdminAuthContext);

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Check if admin is logged in from localStorage on initial load
  useEffect(() => {
    const adminAuth = localStorage.getItem("admin-auth");
    if (adminAuth === "true") {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Hard-coded credentials as per requirements
    if (username === "agriassit" && password === "farmer") {
      setIsAdminAuthenticated(true);
      localStorage.setItem("admin-auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("admin-auth");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
