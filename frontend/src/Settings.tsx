import React, { useState, useEffect } from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Typography, Card, Button, Input, LoadingSpinner } from "./components";
import { useAdmin } from "./hooks/useAdmin";
import { settingsGet, settingsUpdate, Settings as SettingsType } from "./services/settings/settingsService";
import { useToast } from "./components/feedback/ToastContext";
import { classifyError } from "./utils/errorHandler";

interface SettingsProps {
  onBackToDashboard: () => void;
}

export default function Settings({ onBackToDashboard }: SettingsProps) {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // 編集用の状態
  const [grades, setGrades] = useState<string>("");
  const [presentationTypes, setPresentationTypes] = useState<string>("");
  const [groups, setGroups] = useState<string>("");

  // 設定データの取得
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsGet();
      if (result.ok && result.data) {
        setSettings(result.data);
        setGrades(result.data.grades.items.join(", "));
        setPresentationTypes(result.data.presentationTypes.items.join(", "));
        setGroups(result.data.groups.items.join(", "));
      }
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAdmin) {
      showToast("error", "管理者権限が必要です");
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<SettingsType> = {
        grades: { items: grades.split(",").map(s => s.trim()).filter(Boolean) },
        presentationTypes: { items: presentationTypes.split(",").map(s => s.trim()).filter(Boolean) },
        groups: { items: groups.split(",").map(s => s.trim()).filter(Boolean) },
      };

      const result = await settingsUpdate(payload);
      if (result.ok) {
        showToast("success", "設定を保存しました");
        setEditMode(false);
        await loadSettings();
      }
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setGrades(settings.grades.items.join(", "));
      setPresentationTypes(settings.presentationTypes.items.join(", "));
      setGroups(settings.groups.items.join(", "));
    }
    setEditMode(false);
  };

  if (loading || adminLoading) {
    return (
      <Container>
        <PageHeader
          title="設定"
          description="アプリケーションの設定"
          onBack={onBackToDashboard}
        />
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="設定"
        description="アプリケーションの設定"
        onBack={onBackToDashboard}
      />

      {/* 管理者権限の表示 */}
      <Card style={{ marginBottom: "var(--spacing-lg)", backgroundColor: isAdmin ? "var(--color-success-bg)" : "var(--color-warning-bg)" }}>
        <Typography variant="body" style={{ color: isAdmin ? "var(--color-success)" : "var(--color-warning)" }}>
          {isAdmin ? "✓ 管理者権限あり - 設定を編集できます" : "⚠️ 管理者権限がありません"}
        </Typography>
      </Card>

      {/* 管理者のみ基本設定を表示 */}
      {!isAdmin ? (
        <Card>
          <Typography variant="h2" style={{ marginBottom: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
            アクセス制限
          </Typography>
          <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
            この画面は管理者のみがアクセスできます。
          </Typography>
          <Typography variant="body" style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
            管理者権限が必要な場合は、システム管理者にお問い合わせください。
          </Typography>
        </Card>
      ) : (
        <Card>
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <Typography variant="h2" style={{ marginBottom: "var(--spacing-md)" }}>
              基本設定
            </Typography>
          
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <Typography variant="body" style={{ fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
              学年
            </Typography>
            <Typography variant="caption" style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--color-text-sub)" }}>
              カンマ区切りで入力してください（例：B1, B2, B3, B4, M1, M2, D1, D2, D3）
            </Typography>
            {editMode && isAdmin ? (
              <Input
                type="text"
                value={grades}
                onChange={(value) => setGrades(value)}
                placeholder="B1, B2, B3, B4, M1, M2, D1, D2, D3"
              />
            ) : (
              <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                {settings?.grades.items.join(", ") || "未設定"}
              </Typography>
            )}
          </div>

          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <Typography variant="body" style={{ fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
              発表種別
            </Typography>
            <Typography variant="caption" style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--color-text-sub)" }}>
              カンマ区切りで入力してください（例：輪講, 卒論, 修論, 博論）
            </Typography>
            {editMode && isAdmin ? (
              <Input
                type="text"
                value={presentationTypes}
                onChange={(value) => setPresentationTypes(value)}
                placeholder="輪講, 卒論, 修論, 博論"
              />
            ) : (
              <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                {settings?.presentationTypes.items.join(", ") || "未設定"}
              </Typography>
            )}
          </div>

          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <Typography variant="body" style={{ fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
              グループ
            </Typography>
            <Typography variant="caption" style={{ display: "block", marginBottom: "var(--spacing-sm)", color: "var(--color-text-sub)" }}>
              カンマ区切りで入力してください（例：情報学, 工学, その他）
            </Typography>
            {editMode && isAdmin ? (
              <Input
                type="text"
                value={groups}
                onChange={(value) => setGroups(value)}
                placeholder="情報学, 工学, その他"
              />
            ) : (
              <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                {settings?.groups.items.join(", ") || "未設定"}
              </Typography>
            )}
          </div>
        </div>

          <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "flex-end" }}>
            {editMode ? (
              <>
                <Button variant="secondary" onClick={handleCancel} disabled={saving}>
                  キャンセル
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={saving}>
                  {saving ? "保存中..." : "保存"}
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setEditMode(true)}>
                編集
              </Button>
            )}
          </div>
        </Card>
      )}
    </Container>
  );
}
