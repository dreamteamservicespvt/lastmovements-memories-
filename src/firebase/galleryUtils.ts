import { 
  collection, addDoc, getDocs, deleteDoc, doc, 
  updateDoc, query, orderBy, serverTimestamp, 
  where, getDoc, limit, Timestamp 
} from "firebase/firestore";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { db } from "./firebaseConfig";
import { uploadImageToCloudinary } from "../utils/cloudinaryUtils";

export interface GalleryImage {
  id?: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  category: "poster" | "event" | "memory" | "other";
  featured: boolean;
  timestamp?: Timestamp;
  storageRef?: string;
}

// Get all gallery images or filtered by category
export const getGalleryImages = async (category?: string) => {
  try {
    const galleryRef = collection(db, "gallery");
    let galleryQuery;
    
    if (category && category !== "all") {
      galleryQuery = query(
        galleryRef, 
        where("category", "==", category),
        orderBy("timestamp", "desc")
      );
    } else {
      galleryQuery = query(galleryRef, orderBy("timestamp", "desc"));
    }
    
    const querySnapshot = await getDocs(galleryQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...(data as object) // explicitly cast data to an object
      } as GalleryImage;
    });
  } catch (error) {
    console.error("Error getting gallery images:", error);
    throw error;
  }
};

// Get featured images
export const getFeaturedImages = async (limitCount = 6) => {
  try {
    const galleryRef = collection(db, "gallery");
    const galleryQuery = query(
      galleryRef, 
      where("featured", "==", true),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(galleryQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GalleryImage[];
  } catch (error) {
    console.error("Error getting featured images:", error);
    throw error;
  }
};

// Add a new gallery image
export const addGalleryImage = async (image: File, imageData: Omit<GalleryImage, "imageUrl" | "thumbnailUrl" | "timestamp" | "id">) => {
  try {
    // Upload to Cloudinary instead of Firebase Storage
    const cloudinaryResponse = await uploadImageToCloudinary(image);
    
    // Save to Firestore
    const galleryData = {
      ...imageData,
      imageUrl: cloudinaryResponse.secure_url,
      thumbnailUrl: cloudinaryResponse.secure_url, // Use the same URL as thumbnail
      storageRef: cloudinaryResponse.public_id, // Store Cloudinary public_id for deletion purposes
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "gallery"), galleryData);
    
    // Remove timestamp from galleryData to avoid type mismatch
    const { timestamp, ...galleryDataWithoutTimestamp } = galleryData;
    
    return {
      id: docRef.id,
      ...galleryDataWithoutTimestamp
    };
  } catch (error) {
    console.error("Error adding gallery image:", error);
    throw error;
  }
};

// Update gallery image details
export const updateGalleryImage = async (id: string, data: Partial<GalleryImage>) => {
  try {
    const docRef = doc(db, "gallery", id);
    await updateDoc(docRef, {
      ...data,
      timestamp: serverTimestamp()
    });
    
    return { id, ...data };
  } catch (error) {
    console.error("Error updating gallery image:", error);
    throw error;
  }
};

// Delete gallery image
export const deleteGalleryImage = async (id: string) => {
  try {
    // Get the image data
    const docRef = doc(db, "gallery", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const imageData = docSnap.data() as GalleryImage;
      
      // If we have a Cloudinary public_id, we should delete from Cloudinary
      // This would require a server-side function as Cloudinary API keys shouldn't be exposed in client code
      // For now, just delete from Firestore
      
      await deleteDoc(docRef);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
};
