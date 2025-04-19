import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, query } from "firebase/firestore";
import { EventSettings, getEventSettings, EventDetails, getEventDetails } from "../firebase/firestoreUtils";

interface EventSettingsContextType {
  eventSettings: EventSettings | null;
  eventDetails: EventDetails | null;
  refreshSettings: () => Promise<void>;
  refreshDetails: () => Promise<void>;
}

const EventSettingsContext = createContext<EventSettingsContextType | undefined>(undefined);

export const EventSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eventSettings, setEventSettings] = useState<EventSettings | null>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  
  const refreshSettings = async () => {
    try {
      const settings = await getEventSettings();
      setEventSettings(settings);
    } catch (error) {
      console.error("Error fetching event settings:", error);
    }
  };
  
  const refreshDetails = async () => {
    try {
      const details = await getEventDetails();
      setEventDetails(details);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  
  useEffect(() => {
    // Initial fetch
    refreshSettings();
    refreshDetails();
    
    // Set up real-time listeners for both collections
    const eventSettingsQuery = query(collection(db, "eventSettings"));
    const eventDetailsQuery = query(collection(db, "eventDetails"));
    
    const settingsUnsubscribe = onSnapshot(eventSettingsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setEventSettings({ id: doc.id, ...doc.data() } as EventSettings);
      }
    }, (error) => {
      console.error("Error listening to settings changes:", error);
    });
    
    const detailsUnsubscribe = onSnapshot(eventDetailsQuery, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setEventDetails({ id: doc.id, ...doc.data() } as EventDetails);
      }
    }, (error) => {
      console.error("Error listening to details changes:", error);
    });
    
    // Clean up listeners on unmount
    return () => {
      settingsUnsubscribe();
      detailsUnsubscribe();
    };
  }, []);
  
  return (
    <EventSettingsContext.Provider
      value={{
        eventSettings,
        eventDetails,
        refreshSettings,
        refreshDetails
      }}
    >
      {children}
    </EventSettingsContext.Provider>
  );
};

export const useEventSettings = () => {
  const context = useContext(EventSettingsContext);
  if (context === undefined) {
    throw new Error("useEventSettings must be used within an EventSettingsProvider");
  }
  return context;
};
