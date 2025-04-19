import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  doc,
  serverTimestamp
} from "firebase/firestore";

export interface RegistrationData {
  name: string;
  year: string;
  rollNumber: string;
  phone: string;
  registrationId: string; // New field for 4-digit ID
  timestamp?: any;
  receiptUrl?: string;
  cloudinaryId?: string;
}

export interface EventDetails {
  id?: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventRestrictions: string;
  lastUpdated?: any;
}

export interface EventSettings {
  id?: string;
  price: number;
  lastUpdated?: any;
}

export const addRegistration = async (data: Omit<RegistrationData, "timestamp" | "registrationId">) => {
  try {
    // Generate a random 4-digit ID
    const generateUniqueId = async (): Promise<string> => {
      const id = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Check if ID already exists
      const registrationsRef = collection(db, "registrations");
      const q = query(registrationsRef, where("registrationId", "==", id));
      const querySnapshot = await getDocs(q);
      
      // If ID exists, generate a new one recursively
      if (!querySnapshot.empty) {
        return generateUniqueId();
      }
      
      return id;
    };
    
    const registrationId = await generateUniqueId();
    
    const registrationWithTimestamp = {
      ...data,
      registrationId,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "registrations"), registrationWithTimestamp);
    return { id: docRef.id, ...registrationWithTimestamp };
  } catch (error) {
    console.error("Error adding registration: ", error);
    throw error;
  }
};

export const updateRegistration = async (id: string, data: Partial<RegistrationData>) => {
  try {
    const docRef = doc(db, "registrations", id);
    await updateDoc(docRef, data);
    return { id, ...data };
  } catch (error) {
    console.error("Error updating registration:", error);
    throw error;
  }
};

export const deleteRegistration = async (id: string) => {
  try {
    const docRef = doc(db, "registrations", id);
    await deleteDoc(docRef);
    return id;
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
};

export const updateRegistrationWithReceipt = async (
  identifier: { field: "phone" | "rollNumber", value: string },
  receiptData: { receiptUrl: string, cloudinaryId: string }
) => {
  try {
    const registrationsRef = collection(db, "registrations");
    
    // If we're looking up by phone, try both with and without the +91 prefix
    let querySnapshot;
    
    if (identifier.field === "phone") {
      // Check if phone already has +91 prefix
      const phoneValue = identifier.value;
      const phoneWithoutPrefix = phoneValue.startsWith('+91') ? phoneValue.substring(3) : phoneValue;
      const phoneWithPrefix = phoneValue.startsWith('+91') ? phoneValue : `+91${phoneValue}`;
      
      // First try with the provided format
      const q1 = query(registrationsRef, where(identifier.field, "==", phoneValue));
      querySnapshot = await getDocs(q1);
      
      // If not found, try with prefix added
      if (querySnapshot.empty) {
        const q2 = query(registrationsRef, where(identifier.field, "==", phoneWithPrefix));
        querySnapshot = await getDocs(q2);
      }
      
      // If still not found, try without prefix
      if (querySnapshot.empty) {
        const q3 = query(registrationsRef, where(identifier.field, "==", phoneWithoutPrefix));
        querySnapshot = await getDocs(q3);
      }
    } else {
      // For non-phone fields, do a normal query
      const q = query(registrationsRef, where(identifier.field, "==", identifier.value));
      querySnapshot = await getDocs(q);
    }
    
    if (querySnapshot.empty) {
      throw new Error(`No registration found with ${identifier.field}: ${identifier.value}`);
    }
    
    const docRef = doc(db, "registrations", querySnapshot.docs[0].id);
    await updateDoc(docRef, receiptData);
    
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data(), ...receiptData };
  } catch (error) {
    console.error("Error updating registration: ", error);
    throw error;
  }
};

export const getAllRegistrations = async () => {
  try {
    const registrationsRef = collection(db, "registrations");
    const querySnapshot = await getDocs(registrationsRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting registrations: ", error);
    throw error;
  }
};

export const getEventDetails = async (): Promise<EventDetails | null> => {
  try {
    const eventDetailsRef = collection(db, "eventDetails");
    const querySnapshot = await getDocs(eventDetailsRef);
    
    if (querySnapshot.empty) {
      // If no event details exist, create default ones
      const defaultDetails: Omit<EventDetails, "id" | "lastUpdated"> = {
        eventDate: "May 28, 2023",
        eventTime: "7:00 PM",
        eventLocation: "Campus Auditorium, Main Building",
        eventRestrictions: "Only for 3rd & 4th year students"
      };
      
      const docRef = await addDoc(collection(db, "eventDetails"), {
        ...defaultDetails,
        lastUpdated: serverTimestamp()
      });
      
      return { id: docRef.id, ...defaultDetails };
    }
    
    // Return the first document (there should only be one)
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as EventDetails;
  } catch (error) {
    console.error("Error getting event details: ", error);
    return null;
  }
};

export const updateEventDetails = async (id: string, data: Partial<EventDetails>): Promise<EventDetails> => {
  try {
    const docRef = doc(db, "eventDetails", id);
    
    const updateData = {
      ...data,
      lastUpdated: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    return { id, ...data } as EventDetails;
  } catch (error) {
    console.error("Error updating event details: ", error);
    throw error;
  }
};

export const getEventSettings = async (): Promise<EventSettings> => {
  try {
    const settingsRef = collection(db, "eventSettings");
    const querySnapshot = await getDocs(settingsRef);
    
    if (querySnapshot.empty) {
      // If no settings exist, create default ones
      const defaultSettings: Omit<EventSettings, "id" | "lastUpdated"> = {
        price: 600
      };
      
      const docRef = await addDoc(collection(db, "eventSettings"), {
        ...defaultSettings,
        lastUpdated: serverTimestamp()
      });
      
      return { id: docRef.id, ...defaultSettings };
    }
    
    // Return the first document (there should only be one)
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as EventSettings;
  } catch (error) {
    console.error("Error getting event settings: ", error);
    // Return default settings if there's an error
    return { price: 600 };
  }
};

export const updateEventSettings = async (id: string, data: Partial<EventSettings>): Promise<EventSettings> => {
  try {
    const docRef = doc(db, "eventSettings", id);
    
    const updateData = {
      ...data,
      lastUpdated: serverTimestamp()
    };
    
    await updateDoc(docRef, updateData);
    
    return { id, ...data } as EventSettings;
  } catch (error) {
    console.error("Error updating event settings: ", error);
    throw error;
  }
};
