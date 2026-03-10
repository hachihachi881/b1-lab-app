import React from "react";
import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { showErrorToUser, classifyError } from "../utils/errorHandler";
import AppLayout from "../layouts/AppLayout";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    padding: 'var(--spacing-lg)',
    background: 'var(--color-bg-main)'
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-bg-sub)',
    padding: 'var(--spacing-xl)',
    borderRadius: 'var(--radius-main)',
    boxShadow: 'var(--shadow-main)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    width: '100%',
    maxWidth: '400px'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'var(--color-primary)',
    marginBottom: 'var(--spacing-lg)'
  };

  const inputStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-button)',
    fontSize: 'var(--font-size-base)'
  };

  const buttonStyle: React.CSSProperties = {
    padding: 'var(--spacing-md)',
    backgroundColor: loading ? 'var(--color-border)' : 'var(--color-primary)',
    color: 'var(--color-secondary)',
    border: 'none',
    borderRadius: 'var(--radius-button)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s'
  };

  const linkStyle: React.CSSProperties = {
    textAlign: 'center',
    marginTop: 'var(--spacing-md)',
    color: 'var(--color-text-sub)',
    fontSize: 'var(--font-size-sm)',
    cursor: 'pointer'
  };

  const handleForgotPassword = () => {
    // TODO: パスワードリセット処理をここに実装！
    alert("どんまいw");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

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
    <AppLayout loginMode>
      <div style={containerStyle}>
        <form style={cardStyle} onSubmit={handleSubmit}>
          <div style={logoStyle}>
            B1LabApp
          </div>
          <input
            type="email"
            placeholder="大学メールアドレス"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
          <div style={linkStyle} onClick={handleForgotPassword}>
            パスワードを忘れた場合
          </div>
        </form>
      </div>
    </AppLayout>
  );
}