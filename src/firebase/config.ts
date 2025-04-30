import { initializeApp, getApps } from 'firebase/app';
import { getAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAhDTxLDeXo5vIiWchJm2XfBjj5XeXtwgg",
  authDomain: "tomo-461d4.firebaseapp.com",
  projectId: "tomo-461d4",
  storageBucket: "tomo-461d4.firebasestorage.app",
  messagingSenderId: "119621785581",
  appId: "1:119621785581:web:8f303602c5e0c46e4bf9e4",
  databaseURL: "https://tomo-461d4.firebaseio.com"
};

// Initialize Firebase only if it hasn't been initialized
let app;
if (Platform.OS === 'web') {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} else {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
}

// Export a function that returns the auth instance
export const getFirebaseAuth = () => {
  const auth = getAuth(app);
  auth.setPersistence(inMemoryPersistence);
  return auth;
};

// Export Firestore instance
export const db = getFirestore(app);

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    const auth = getFirebaseAuth();
    console.log('Firebase connection successful!');
    return true;
  } catch (error) {
    console.error('Firebase connection failed:', error);
    return false;
  }
}; 