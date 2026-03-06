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
import { PostData, Post, ApiResponse } from "../types";
import { safeApiCall } from "../utils/errorHandler";

// 重複した型定義を削除し、../typesからインポート

export const updatePost = async (  //投稿を更新する関数。引数には投稿のIDと更新するデータを渡す
  postId: string,
  data: { title: string; content: string }
): Promise<ApiResponse<void>> => {
  return await safeApiCall(async () => {
    await updateDoc(doc(db, "posts", postId), data);
  }, "Update Post");
};

export const deletePost = async (postId: string): Promise<ApiResponse<void>> => {  //投稿を削除する関数。引数には投稿のIDを渡す
  return await safeApiCall(async () => {
    await deleteDoc(doc(db, "posts", postId));
  }, "Delete Post");
};

export const createPost = async (post: PostData): Promise<ApiResponse<void>> => {  //投稿を作成する関数。引数には投稿のデータを渡す
  return await safeApiCall(async () => {
    await addDoc(collection(db, "posts"), {
      ...post,
      createdAt: serverTimestamp()
    });
  }, "Create Post");
};

export const getPosts = async (): Promise<ApiResponse<Post[]>> => {  //投稿を取得する関数。投稿のデータを配列で返す
  return await safeApiCall(async () => {
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
  }, "Get Posts");
};

export const getMyPosts = async (uid: string): Promise<ApiResponse<Post[]>> => {  //自分の投稿を取得する関数。引数にはユーザのIDを渡す。投稿のデータを配列で返す
  return await safeApiCall(async () => {
    const q = query(
      collection(db, "posts"),
      where("uid", "==", uid)
    );

    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Post))
      .filter(p => p.uid === uid);
  }, "Get My Posts");
};