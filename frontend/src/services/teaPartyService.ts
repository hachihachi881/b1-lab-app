// src/services/teaPartyService.ts
import { db } from "../lib/firebase"; // ※パスはご自身の環境(lib/firebaseなど)に合わせてください
import { doc, getDoc, setDoc } from "firebase/firestore";

export type TeaPartyInfo = {
  title: string;
  datetime: string;
  location: string;
  group: string;
};

// お茶会の情報を取得する
export const getTeaPartyInfo = async () => {
  const snap = await getDoc(doc(db, "settings", "nextTeaParty"));
  return snap.exists() ? (snap.data() as TeaPartyInfo) : null;
};

// お茶会の情報を保存（上書き）する
export const saveTeaPartyInfo = async (data: TeaPartyInfo) => {
  // merge: true を指定することで、ドキュメントが無い場合は新規作成、ある場合は上書きになります
  await setDoc(doc(db, "settings", "nextTeaParty"), data, { merge: true });
};