
import React, { useState } from "react";
import { signIn } from "../firebase/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Login successful!");
      onLoginSuccess();
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different Firebase auth errors
      const errorCode = error.code;
      let errorMessage = "Login failed. Please try again.";
      
      if (errorCode === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-screen flex items-center justify-center p-4"
    >
      <div className="glass-card rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Admin Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full px-4 py-2 rounded-lg text-white"
              placeholder="admin@example.com"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full px-4 py-2 rounded-lg text-white"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="btn-glow w-full mt-6 py-3 px-4 rounded-lg bg-party-purple text-white font-medium transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </motion.button>
          
          <div className="text-center text-sm text-gray-400 mt-4">
            <a href="/" className="text-party-pink hover:text-party-pink-light underline">
              Back to Home
            </a>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
