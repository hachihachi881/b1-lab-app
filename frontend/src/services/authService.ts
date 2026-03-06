import { auth } from "../lib/firebase";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createUser } from "./usersService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { AuthUser, ApiResponse } from "../types";
import { safeApiCall, classifyError, logError } from "../utils/errorHandler";

// export const loginWithGoogle = async () => {
//   const provider = new GoogleAuthProvider();  //Googleの認証プロバイダを作成する
//   const result = await signInWithPopup(auth, provider);  //Googleの認証プロバイダを使ってサインインする。サインインが成功すると、ユーザの情報がresult.userに格納される
//   return result.user;
// };

// export const loginAndCreateUser = async () => {
//   const user = await loginWithGoogle();  //Googleでログインする。ユーザの情報がuserに格納される

//   await createUser(user.uid, {  //ユーザの情報をFirestoreに保存する。ユーザのIDをキーにして、ユーザの名前、メールアドレス、役割を保存する
//     name: user.displayName ?? "unknown",
//     email: user.email ?? "",
//     role: "student"
//   });

//   return user;
// };

// ログイン
export const loginWithEmail = async (email: string, password: string): Promise<ApiResponse<User>> => {
  return await safeApiCall(async () => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res.user;
  }, "Email Login");
};

// 新規登録（必要なら）
export const registerWithEmail = async (email: string, password: string): Promise<ApiResponse<User>> => {
  return await safeApiCall(async () => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res.user;
  }, "Email Registration");
};

// ログアウト
export const logout = async (): Promise<ApiResponse<void>> => {
  return await safeApiCall(async () => {
    await signOut(auth);
  }, "Sign Out");
};