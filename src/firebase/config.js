import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA8PuFTCQTJNOd9FabL22FeYw7emSI0Bis',
  authDomain: 'software-mobile-3435d.firebaseapp.com',
  projectId: 'software-mobile-3435d',
  storageBucket: 'software-mobile-3435d.firebasestorage.app',
  messagingSenderId: '150162357724',
  appId: '1:150162357724:web:18d4ec62c1077dcda6e319',
  measurementId: 'G-949YGLD5JD',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
