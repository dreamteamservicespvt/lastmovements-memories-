
import React from "react";
import { signOut } from "../../firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  onExportCSV: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onExportCSV }) => {
  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h1 className="text-3xl font-bold mb-4 md:mb-0 text-white">Admin Dashboard</h1>
      
      <div className="flex space-x-2">
        <Button
          onClick={onExportCSV}
          className="px-4 py-2 bg-party-purple rounded-lg text-white flex items-center space-x-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>Export CSV</span>
        </Button>
        
        <Button
          onClick={handleSignOut}
          variant="secondary"
          className="px-4 py-2"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
