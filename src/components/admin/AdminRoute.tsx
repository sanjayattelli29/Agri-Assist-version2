
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useEffect, useState } from "react";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdminAuthenticated } = useAdminAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Show nothing while checking auth state to avoid flashing content
  if (isChecking) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default AdminRoute;
