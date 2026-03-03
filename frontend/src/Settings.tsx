import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { isAdmin } from "./services/adminService";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import LoginForm from "./utils/LoginForm";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import Card from "./components/common/Card";
import Button from "./components/common/Button";
import Typography from "./components/common/Typography";
import Spacing from "./components/common/Spacing";

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
      <Container>
        <div style={{ textAlign: "center" }}>
          <p>読み込み中...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="設定"
        description="研究室システムの設定を管理します"
        icon="⚙️"
        onBack={onBackToDashboard}
      />

      {!user ? (
        <Card style={{ maxWidth: 500, margin: "0 auto" }}>
          <Typography variant="h2" margin="medium" style={{ textAlign: "center" }}>
            設定にアクセスするにはログインが必要です
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LoginForm />
          </div>
        </Card>
      ) : !isAdminUser ? (
        <div>
          <Card style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            maxWidth: 600,
            margin: "0 auto 24px"
          }}>
            <Typography variant="h2" margin="small" color="#856404">
              ⚠️ 管理者権限がありません
            </Typography>
            <Typography variant="p" margin="medium" color="#856404" style={{ lineHeight: 1.6 }}>
              現在ログイン中のメールアドレス（{user.email}）は管理者として登録されていません。<br />
              設定を編集する権限がありません。
            </Typography>
            <Typography variant="p" margin="medium" color="#856404" style={{ lineHeight: 1.6 }}>
              間違ったメールアドレスでログインした場合は、以下のボタンでログアウトしてください。
            </Typography>
            <Button
              onClick={() => signOut(auth)}
              style={{ background: "#ef4444" }}
            >
              ログアウト
            </Button>
          </Card>

          <Card style={{ maxWidth: 500, margin: "0 auto" }}>
            <Typography variant="h2" margin="medium" style={{ textAlign: "center", fontSize: 18 }}>
              管理者アカウントでログインする
            </Typography>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <LoginForm />
            </div>
          </Card>
        </div>
      ) : (
        <div>
          {/* 管理者向けの設定項目 */}
          <Card>
            <Typography variant="h2" margin="small" color="#059669">
              ✓ 管理者権限あり
            </Typography>
            <Typography variant="p" margin="lg" color="#6b7280">
              ログイン中: {user.email}
            </Typography>

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
          </Card>
        </div>
      )}
    </Container>
  );
}
