import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASfFG29saZgb6-6yW2AHIon9QCukkJkGQ",
  authDomain: "b1-lab-app.firebaseapp.com",
  projectId: "b1-lab-app",
  storageBucket: "b1-lab-app.appspot.com",
  messagingSenderId: "889991994244",
  appId: "1:889991994244:web:6038e4f08e68b4c6415bd1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

if (location.hostname === "localhost") {
  // connectFirestoreEmulator(db, "localhost", 8080);
  // connectAuthEmulator(auth, "http://localhost:9099");
}