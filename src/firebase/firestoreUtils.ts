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
  timestamp?: any;
  receiptUrl?: string;
  cloudinaryId?: string;
}

export const addRegistration = async (data: Omit<RegistrationData, "timestamp">) => {
  try {
    const registrationWithTimestamp = {
      ...data,
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
    const q = query(registrationsRef, where(identifier.field, "==", identifier.value));
    const querySnapshot = await getDocs(q);
    
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
