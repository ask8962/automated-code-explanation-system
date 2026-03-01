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

      // ✅ DIRECT FIREBASE CONFIG
      const firebaseConfig = {
        apiKey: "AIzaSyB8gA0wRI1YyKwnQk-usRjh-KbpGnBOxu4",
        authDomain: "gla-code-explain.firebaseapp.com",
        projectId: "gla-code-explain",
        storageBucket: "gla-code-explain.firebasestorage.app",
        messagingSenderId: "448137426080",
        appId: "1:448137426080:web:50cf6851892ec8cc2a05c5",
        measurementId: "G-NL8DV1VW35"
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
