import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getAllRegistrations, updateRegistration, deleteRegistration, RegistrationData } from "../firebase/firestoreUtils";
import SearchBar from "./admin/SearchBar";
import RegistrationTable from "./admin/RegistrationTable";
import ReceiptModal from "./admin/ReceiptModal";
import EventDetailsEditor from "./admin/EventDetailsEditor";
import EventSettingsEditor from "./admin/EventSettingsEditor";
import GalleryManager from "./admin/GalleryManager";

interface RegistrationWithId extends RegistrationData {
  id: string;
}

// Define tab types
type TabType = "registrations" | "pricing" | "details" | "gallery";

const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("registrations");
  
  useEffect(() => {
    fetchRegistrations();
  }, []);
  
  const fetchRegistrations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRegistrations() as RegistrationWithId[];
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRegistration = async (id: string, data: Partial<RegistrationData>) => {
    try {
      await updateRegistration(id, data);
      toast.success("Registration updated successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error updating registration:", error);
      toast.error("Failed to update registration");
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      await deleteRegistration(id);
      toast.success("Registration deleted successfully");
      fetchRegistrations();
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast.error("Failed to delete registration");
    }
  };
  
  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Year", "Roll Number", "Phone", "Timestamp", "Receipt URL"];
    const rows = registrations.map((reg) => [
      reg.registrationId || "N/A",
      reg.name,
      reg.year,
      reg.rollNumber,
      reg.phone,
      reg.timestamp ? new Date(reg.timestamp.seconds * 1000).toLocaleString() : "",
      reg.receiptUrl || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `registrations-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const filteredRegistrations = registrations.filter(reg => {
    const searchLower = searchTerm.toLowerCase();
    return (
      reg.name?.toLowerCase().includes(searchLower) ||
      reg.rollNumber?.toLowerCase().includes(searchLower) ||
      reg.phone?.includes(searchTerm)
    );
  });

  // Tab switching function
  const renderTabContent = () => {
    switch (activeTab) {
      case "registrations":
        return (
          <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl p-6 mb-6">
              <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-xl overflow-hidden">
              <RegistrationTable 
                registrations={filteredRegistrations}
                isLoading={isLoading}
                onViewReceipt={(url) => setSelectedReceipt(url)}
                onEditRegistration={handleEditRegistration}
                onDeleteRegistration={handleDeleteRegistration}
              />
            </div>
          </>
        );
      case "pricing":
        return <EventSettingsEditor />;
      case "details":
        return <EventDetailsEditor />;
      case "gallery":
        return <GalleryManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black pb-12">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Admin Header */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-party-purple to-party-pink">
                Admin Dashboard
              </span>
            </h1>
            
            {activeTab === "registrations" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="px-6 py-3 rounded-lg bg-party-purple/20 text-party-purple border border-party-purple/30 hover:bg-party-purple/30 transition-all duration-300 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
              </motion.button>
            )}
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
              <h3 className="text-blue-400 text-sm font-medium">Total Registrations</h3>
              <p className="text-white text-2xl font-bold">{registrations.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/20">
              <h3 className="text-green-400 text-sm font-medium">Receipts Uploaded</h3>
              <p className="text-white text-2xl font-bold">
                {registrations.filter(r => r.receiptUrl).length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-party-purple/10 to-party-pink/10 p-4 rounded-xl border border-party-pink/20">
              <h3 className="text-party-pink text-sm font-medium">3rd Year Students</h3>
              <p className="text-white text-2xl font-bold">
                {registrations.filter(r => r.year === "3rd").length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 p-4 rounded-xl border border-amber-500/20">
              <h3 className="text-amber-400 text-sm font-medium">4th Year Students</h3>
              <p className="text-white text-2xl font-bold">
                {registrations.filter(r => r.year === "4th").length}
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-8 overflow-x-auto scrollbar-hide">
            {[
              { id: "registrations", label: "Registration Info", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ) },
              { id: "pricing", label: "Event Pricing", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) },
              { id: "details", label: "Event Details", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) },
              { id: "gallery", label: "Gallery Manager", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "text-party-pink border-b-2 border-party-pink" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </motion.div>
      </div>
      
      <ReceiptModal
        receiptUrl={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default AdminDashboard;
