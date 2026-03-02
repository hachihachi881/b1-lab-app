import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {  //Firebaseの設定情報。環境変数から取得する
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MSG,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);  //Firebaseアプリを初期化する

export const db = getFirestore(app);  //Firestoreのインスタンスを取得する
export const auth = getAuth(app);  //Authのインスタンスを取得する

if (location.hostname === "localhost") {
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectAuthEmulator(auth, "http://localhost:9099");
}