
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBppBoZ8nmNQSRGXbfq6ed0kvCKP-tej6Q",
  authDomain: "lastmovements-6b3d1.firebaseapp.com",
  projectId: "lastmovements-6b3d1",
  storageBucket: "lastmovements-6b3d1.appspot.com",
  messagingSenderId: "1048340978110",
  appId: "1:1048340978110:web:ce159540e7eb27293c41ef",
  measurementId: "G-LW7VFWXC6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
let analytics: any = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { db, auth, analytics };
export default app;
