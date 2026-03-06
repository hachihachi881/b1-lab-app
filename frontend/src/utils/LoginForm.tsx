import React from "react";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

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
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      // 初回なら自動作成
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        alert("ログイン失敗: " + err.message);
      }
    }

    setLoading(false);
  };

  return (
    <div style={{
      padding: 24,
      background: "white",
      borderRadius: 12,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      width: 300
    }}>
      <h3 style={{ marginBottom: 16 }}>研究室ログイン</h3>

      <input
        type="email"
        placeholder="大学メール"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 12,
          border: "1px solid #ccc",
          borderRadius: 6
        }}
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 16,
          border: "1px solid #ccc",
          borderRadius: 6
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: "#3b82f6",
          color: "white",
          borderRadius: 6,
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </div>
  );
}