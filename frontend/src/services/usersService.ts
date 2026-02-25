import { db } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export type User = {
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
};

export const createUser = async (uid: string, data: User) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const getUser = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};