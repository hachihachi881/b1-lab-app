import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * 指定されたメールアドレスが管理者かどうかをチェック
 */
export const isAdmin = async (email: string | null): Promise<boolean> => {
  if (!email) return false;
  
  try {
    console.log("管理者チェック開始。メール:", email);
    const adminDoc = await getDoc(doc(db, "admins", email));
    console.log("ドキュメント存在:", adminDoc.exists());
    if (adminDoc.exists()) {
      console.log("ドキュメントデータ:", adminDoc.data());
    }
    return adminDoc.exists();
  } catch (error) {
    console.error("管理者チェックエラー:", error);
    return false;
  }
};

/**
 * 管理者を追加（初期セットアップ用）
 * Firestoreコンソールで手動で追加することを推奨
 */
export const addAdmin = async (email: string): Promise<void> => {
  try {
    await setDoc(doc(db, "admins", email), {
      email,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("管理者追加エラー:", error);
    throw error;
  }
};
