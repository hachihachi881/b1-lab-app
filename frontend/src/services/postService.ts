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

export const updatePost = async (  //投稿を更新する関数。引数には投稿のIDと更新するデータを渡す
  postId: string,
  data: { title: string; content: string }
) => {
  await updateDoc(doc(db, "posts", postId), data);
};

export const deletePost = async (postId: string) => {  //投稿を削除する関数。引数には投稿のIDを渡す
  await deleteDoc(doc(db, "posts", postId));
};

export const createPost = async (post: any) => {  //投稿を作成する関数。引数には投稿のデータを渡す
  await addDoc(collection(db, "posts"), {
    ...post,
    createdAt: serverTimestamp()
  });
};

export const getPosts = async () => {  //投稿を取得する関数。投稿のデータを配列で返す
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getMyPosts = async (uid: string) => {  //自分の投稿を取得する関数。引数にはユーザのIDを渡す。投稿のデータを配列で返す
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