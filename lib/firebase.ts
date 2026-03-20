'use client';

let auth: any = null;
let db: any = null;
let firebaseReady = false;

export const initializeFirebase = async () => {
  if (firebaseReady) return { auth, db };

  try {
    if (typeof window !== 'undefined') {
      const { initializeApp } = await import('firebase/app');
      const { getAuth, setPersistence, browserLocalPersistence } = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');

      // ✅ Firebase config from environment variables
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
      };

      const app = initializeApp(firebaseConfig);

      auth = getAuth(app);
      db = getFirestore(app);

      // Persist login
      await setPersistence(auth, browserLocalPersistence);

      console.log('[Auth] Firebase initialized successfully');
    }
  } catch (error: any) {
    console.error('[Auth] Firebase init failed:', error.message);
  }

  firebaseReady = true;
  return { auth, db };
};

export { auth, db };
