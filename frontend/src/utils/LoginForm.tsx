import React from "react";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { showErrorToUser, classifyError } from "../utils/errorHandler";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.endsWith("@tokushima-u.ac.jp")) {
      alert("大学メールのみログインできます");
      return;
    }

    if (!password) {
      alert("パスワードを入力してください");
      return;
    }

    setLoading(true);

    try {
      // 既にログインしているユーザーがいる場合、まずログアウト
      if (auth.currentUser) {
        await signOut(auth);
      }

      // 既存ユーザーならログイン
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (loginError: any) {
        console.error("ログインエラー:", loginError);
        // 初回なら自動作成を試行
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("認証エラー:", error);
      const appError = classifyError(error);
      showErrorToUser(appError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="大学メールアドレス"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </div>
  );
}