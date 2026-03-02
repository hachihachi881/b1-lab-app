import { db } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export type User = {
  name: string;
  email: string;
  role: "student" | "professor" | "admin";
};

export const createUser = async (uid: string, data: User) => {  //ユーザを作成する関数。引数にはユーザのIDとユーザのデータを渡す
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp()  //ユーザの作成日時を保存するために、serverTimestamp()を使ってFirestoreのサーバの時間を保存する
  });
};

export const getUser = async (uid: string) => {  //ユーザを取得する関数。引数にはユーザのIDを渡す。ユーザのデータを返す
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};