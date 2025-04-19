import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EventSettings, getEventSettings, updateEventSettings } from "../../firebase/firestoreUtils";
import { useEventSettings } from "../../contexts/EventSettingsContext";

const EventSettingsEditor: React.FC = () => {
  const { eventSettings: contextSettings, refreshSettings } = useEventSettings();
  const [settings, setSettings] = useState<EventSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (contextSettings) {
      setSettings(contextSettings);
      setIsLoading(false);
    } else {
      fetchSettings();
    }
  }, [contextSettings]);
  
  const fetchSettings = async () => {
    try {
      const data = await getEventSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching event settings:", error);
      toast.error("Failed to load event settings");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings || !settings.id) return;
    
    setIsSaving(true);
    
    try {
      await updateEventSettings(settings.id, {
        price: settings.price
      });
      
      // Refresh the context to update all components
      await refreshSettings();
      
      toast.success("Event price updated successfully");
    } catch (error) {
      console.error("Error updating event settings:", error);
      toast.error("Failed to update event price");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-4 border-party-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load event settings. Please refresh the page.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-party-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Event Pricing
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">Entry Fee (₹)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">₹</span>
            <input
              type="number"
              min="0"
              step="1"
              value={settings.price}
              onChange={(e) => setSettings({ ...settings, price: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-700 text-white rounded-lg pl-8 pr-4 py-3 border border-gray-600 focus:border-party-pink focus:ring-1 focus:ring-party-pink focus:outline-none text-lg"
            />
          </div>
          <p className="text-gray-400 text-sm mt-1">Current price: ₹{settings.price}</p>
        </div>
        
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-party-purple to-party-pink text-white font-medium rounded-lg shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </div>
          ) : (
            "Update Price"
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default EventSettingsEditor;
