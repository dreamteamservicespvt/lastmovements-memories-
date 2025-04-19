
import React, { useEffect, useState } from "react";
import AdminLogin from "../components/AdminLogin";
import AdminDashboard from "../components/AdminDashboard";
import { isAuthenticated } from "../firebase/auth";
import { motion } from "framer-motion";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    setIsCheckingAuth(true);
    try {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setIsCheckingAuth(false);
    }
  };
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-party-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {isLoggedIn ? (
        <AdminDashboard />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </motion.div>
  );
};

export default Admin;
