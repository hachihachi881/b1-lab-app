import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const testWrite = async () => {
  try {
    await addDoc(collection(db, "test"), {
      message: "hello firebase",
      createdAt: new Date()
    });
    alert("書き込み成功！");
  } catch (e) {
    console.error(e);
    alert("書き込み失敗");
  }
};