import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

export type Post = {
  title: string;
  content: string;
};

export const createPost = async (data: Post) => {
  await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const getPosts = async () => {
  const snap = await getDocs(collection(db, "posts"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};