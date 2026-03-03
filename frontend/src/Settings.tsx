import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { isAdmin } from "./services/adminService";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import LoginForm from "./utils/LoginForm";

interface SettingsProps {
  onBackToDashboard: () => void;
}

export default function Settings({ onBackToDashboard }: SettingsProps) {
  const { user, loading } = useAuth();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user?.email) {
      console.log("チェック中のメールアドレス:", user.email);
      isAdmin(user.email).then(result => {
        console.log("管理者チェック結果:", result);
        setIsAdminUser(result);
        setCheckingAdmin(false);
      }).catch(error => {
        console.error("管理者チェックエラー:", error);
        setCheckingAdmin(false);
      });
    } else {
      setCheckingAdmin(false);
    }
  }, [user]);

  if (loading || checkingAdmin) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1200, margin: "0 auto" }}>
      <button 
        onClick={onBackToDashboard}
        style={{
          marginBottom: 24,
          padding: "8px 16px",
          background: "white",
          border: "1px solid #ddd",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 14
        }}
      >
        ← ダッシュボードに戻る
      </button>

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>設定</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>
        研究室システムの設定を管理します
      </p>

      {!user ? (
        <div style={{ 
          background: "white", 
          padding: 40, 
          borderRadius: 12, 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          maxWidth: 500,
          margin: "0 auto"
        }}>
          <h2 style={{ fontSize: 20, marginBottom: 16, textAlign: "center" }}>
            設定にアクセスするにはログインが必要です
          </h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LoginForm />
          </div>
        </div>
      ) : !isAdminUser ? (
        <div>
          <div style={{ 
            background: "#fff3cd", 
            padding: 24, 
            borderRadius: 12,
            border: "1px solid #ffc107",
            maxWidth: 600,
            margin: "0 auto 24px"
          }}>
            <h2 style={{ fontSize: 20, marginBottom: 12, color: "#856404" }}>
              ⚠️ 管理者権限がありません
            </h2>
            <p style={{ color: "#856404", lineHeight: 1.6, marginBottom: 16 }}>
              現在ログイン中のメールアドレス（{user.email}）は管理者として登録されていません。<br />
              設定を編集する権限がありません。
            </p>
            <p style={{ color: "#856404", lineHeight: 1.6, marginBottom: 16 }}>
              間違ったメールアドレスでログインした場合は、以下のボタンでログアウトしてください。
            </p>
            <button
              onClick={() => signOut(auth)}
              style={{
                padding: "10px 20px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: "bold"
              }}
            >
              ログアウト
            </button>
          </div>
          
          <div style={{ 
            background: "white", 
            padding: 40, 
            borderRadius: 12, 
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: 500,
            margin: "0 auto"
          }}>
            <h2 style={{ fontSize: 18, marginBottom: 16, textAlign: "center" }}>
              管理者アカウントでログインする
            </h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LoginForm />
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* 管理者向けの設定項目 */}
          <div style={{
            background: "white",
            padding: 32,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginBottom: 24
          }}>
            <h2 style={{ fontSize: 20, marginBottom: 8, color: "#059669" }}>
              ✓ 管理者権限あり
            </h2>
            <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 24 }}>
              ログイン中: {user.email}
            </p>

            <div style={{ 
              borderTop: "1px solid #e5e7eb", 
              paddingTop: 24 
            }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                研究室パスワード設定
              </h3>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                研究室メンバーがログインする際に使用する共通パスワードを設定できます。
              </p>
              
              <div style={{ 
                background: "#f9fafb", 
                padding: 16, 
                borderRadius: 8,
                border: "1px solid #e5e7eb"
              }}>
                <p style={{ fontSize: 14, color: "#374151" }}>
                  現在のパスワード: <code style={{ 
                    background: "#e5e7eb", 
                    padding: "2px 8px", 
                    borderRadius: 4,
                    fontFamily: "monospace"
                  }}>b1lab2026</code>
                </p>
                <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                  ※ パスワードの変更機能は今後実装予定です。<br />
                  現在は LoginForm.tsx を直接編集してください。
                </p>
              </div>
            </div>

            <div style={{ 
              borderTop: "1px solid #e5e7eb", 
              paddingTop: 24,
              marginTop: 24
            }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>
                管理者の追加方法
              </h3>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 12 }}>
                新しい管理者を追加するには、Firebaseコンソールから以下の手順で追加してください：
              </p>
              <ol style={{ color: "#374151", fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
                <li>Firebaseコンソールで Firestore Database を開く</li>
                <li>「admins」コレクションを選択（なければ作成）</li>
                <li>ドキュメントIDに管理者のメールアドレスを入力</li>
                <li>フィールドに email（文字列）と createdAt（タイムスタンプ）を追加</li>
                <li>保存</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
