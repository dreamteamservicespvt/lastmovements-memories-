import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EventDetails, getEventDetails, updateEventDetails } from "../../firebase/firestoreUtils";
import { useEventSettings } from "../../contexts/EventSettingsContext";

const EventDetailsEditor: React.FC = () => {
  const { eventDetails: contextDetails, refreshDetails } = useEventSettings();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await getEventDetails();
        setEventDetails(details);
      } catch (error) {
        console.error("Error fetching event details:", error);
        toast.error("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (contextDetails) {
      setEventDetails(contextDetails);
      setIsLoading(false);
    } else {
      fetchEventDetails();
    }
  }, [contextDetails]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventDetails || !eventDetails.id) return;
    
    setIsSaving(true);
    
    try {
      await updateEventDetails(eventDetails.id, {
        eventDate: eventDetails.eventDate,
        eventTime: eventDetails.eventTime,
        eventLocation: eventDetails.eventLocation,
        eventRestrictions: eventDetails.eventRestrictions
      });
      
      // Refresh the context to update all components
      await refreshDetails();
      
      toast.success("Event details updated successfully");
    } catch (error) {
      console.error("Error updating event details:", error);
      toast.error("Failed to update event details");
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
  
  if (!eventDetails) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load event details. Please refresh the page.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Event Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Event Date</label>
          <input
            type="text"
            value={eventDetails.eventDate}
            onChange={(e) => setEventDetails({ ...eventDetails, eventDate: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-party-pink focus:ring-1 focus:ring-party-pink focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Event Time</label>
          <input
            type="text"
            value={eventDetails.eventTime}
            onChange={(e) => setEventDetails({ ...eventDetails, eventTime: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-party-pink focus:ring-1 focus:ring-party-pink focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Event Location</label>
          <input
            type="text"
            value={eventDetails.eventLocation}
            onChange={(e) => setEventDetails({ ...eventDetails, eventLocation: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-party-pink focus:ring-1 focus:ring-party-pink focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Event Restrictions</label>
          <input
            type="text"
            value={eventDetails.eventRestrictions}
            onChange={(e) => setEventDetails({ ...eventDetails, eventRestrictions: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-party-pink focus:ring-1 focus:ring-party-pink focus:outline-none"
          />
        </div>
        
        <motion.button
          type="submit"
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-party-purple text-white font-medium rounded-lg shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Event Details"}
        </motion.button>
      </form>
    </div>
  );
};

export default EventDetailsEditor;
