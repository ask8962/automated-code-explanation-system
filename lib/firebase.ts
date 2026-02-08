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
        apiKey: "AIzaSyCh-3D0NleJNxnQ-UnM0GP2QkKTvXHTjFU",
        authDomain: "lifeos-ai-f1557.firebaseapp.com",
        projectId: "lifeos-ai-f1557",
        storageBucket: "lifeos-ai-f1557.firebasestorage.app",
        messagingSenderId: "540508248849",
        appId: "1:540508248849:web:4180820c777ed661500ab0",
        measurementId: "G-WC1HQ5LQMN"
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
