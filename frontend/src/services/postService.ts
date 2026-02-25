import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where
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

export const getMyPosts = async (uid: string) => {
  const q = query(
    collection(db, "posts"),
    where("uid", "==", uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export type Post = {
  title: string;
  content: string;
  uid: string;
  authorName: string;
};