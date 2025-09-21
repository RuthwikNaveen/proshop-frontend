import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAUGusZglfxsarM9xMQ1hfu8lcTmU4s2qw",
  authDomain: "proshop-marketplace.firebaseapp.com",
  projectId: "proshop-marketplace",
  storageBucket: "proshop-marketplace.firebasestorage.app",
  messagingSenderId: "986777162527",
  appId: "1:986777162527:web:35df823270216ff2d0162a",
  measurementId: "G-N44DPX3NVR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };

