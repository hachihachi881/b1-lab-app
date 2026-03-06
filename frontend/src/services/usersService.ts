import { db } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { User, ApiResponse } from "../types";
import { safeApiCall } from "../utils/errorHandler";

export const createUser = async (uid: string, data: User): Promise<ApiResponse<void>> => {  //ユーザを作成する関数。引数にはユーザのIDとユーザのデータを渡す
  return await safeApiCall(async () => {
    await setDoc(doc(db, "users", uid), {
      ...data,
      createdAt: serverTimestamp()  //ユーザの作成日時を保存するために、serverTimestamp()を使ってFirestoreのサーバの時間を保存する
    });
  }, "Create User");
};

export const getUser = async (uid: string): Promise<ApiResponse<User | null>> => {  //ユーザを取得する関数。引数にはユーザのIDを渡す。ユーザのデータを返す
  return await safeApiCall(async () => {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as User) : null;
  }, "Get User");
};