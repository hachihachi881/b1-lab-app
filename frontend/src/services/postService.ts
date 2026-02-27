import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  orderBy
} from "firebase/firestore";

export type Post = {
  title: string;
  content: string;
};

export const updatePost = async (
  postId: string,
  data: { title: string; content: string }
) => {
  await updateDoc(doc(db, "posts", postId), data);
};

export const deletePost = async (postId: string) => {
  await deleteDoc(doc(db, "posts", postId));
};

export const createPost = async (post: any) => {
  await addDoc(collection(db, "posts"), {
    ...post,
    createdAt: serverTimestamp()
  });
};

export const getPosts = async () => {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getMyPosts = async (uid: string) => {
  const q = query(
    collection(db, "posts"),
    where("uid", "==", uid)
  );

  const snap = await getDocs(q);
  return snap.docs
  .map(d => ({ id: d.id, ...d.data() }))
  .filter(p => p.uid === uid);
};

export type Post = {
  title: string;
  content: string;
  uid: string;
  authorName: string;
};