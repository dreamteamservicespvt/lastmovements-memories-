
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { getAllRegistrations, updateRegistration, deleteRegistration, RegistrationData } from "../firebase/firestoreUtils";
import AdminHeader from "./admin/AdminHeader";
import SearchBar from "./admin/SearchBar";
import RegistrationTable from "./admin/RegistrationTable";
import ReceiptModal from "./admin/ReceiptModal";

interface RegistrationWithId extends RegistrationData {
  id: string;
}

const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
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
    const headers = ["Name", "Year", "Roll Number", "Phone", "Timestamp", "Receipt URL"];
    const rows = registrations.map((reg) => [
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <AdminHeader onExportCSV={handleExportCSV} />
      
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-4">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>
        
        <RegistrationTable
          registrations={filteredRegistrations}
          isLoading={isLoading}
          onViewReceipt={(url) => setSelectedReceipt(url)}
          onEditRegistration={handleEditRegistration}
          onDeleteRegistration={handleDeleteRegistration}
        />
      </div>
      
      <ReceiptModal
        receiptUrl={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </motion.div>
  );
};

export default AdminDashboard;
