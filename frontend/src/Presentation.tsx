import React, { useState } from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Button, Card, Input, TextArea, Typography, useToast } from "./components";
import { useAdmin } from "./hooks/useAdmin";
import {
  fromLocalDateTimeInputValue,
  PRESENTATION_KIND_LABELS,
  toDateKey,
  toLocalDateTimeInputValue,
} from "./lib/presentations";

interface PresentationProps {
  onBackToDashboard: () => void;
}

type PresentationSlotDraft = {
  localId: string;
  kind: "presenter" | "break" | "host";
  startAt: string;
  endAt: string;
  memberUid: string;
};

type PresentationDraft = {
  date: string;
  type: string;
  notes: string;
  slots: PresentationSlotDraft[];
};

const nativeFieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "var(--spacing-md)",
  borderRadius: "var(--radius-button)",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-sub)",
  color: "var(--color-text-main)",
  fontSize: "var(--font-size-base)",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-xs)",
  fontSize: "var(--font-size-sm)",
  fontWeight: 600,
  color: "var(--color-text-main)",
};

export default function Presentation({ onBackToDashboard }: PresentationProps) {
  const { isAdmin } = useAdmin();
  const { showToast } = useToast();
  const [draft, setDraft] = useState<PresentationDraft>({
    date: toDateKey(new Date()),
    type: "",
    notes: "",
    slots: [],
  });
  const [formError, setFormError] = useState<string>("");

  const resetForm = () => {
    setDraft({
      date: toDateKey(new Date()),
      type: "",
      notes: "",
      slots: [],
    });
    setFormError("");
  };

  const updateDraft = <K extends keyof PresentationDraft>(key: K, value: PresentationDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateSlot = (localId: string, key: keyof PresentationSlotDraft, value: string) => {
    setDraft((current) => ({
      ...current,
      slots: current.slots.map((slot) => (slot.localId === localId ? { ...slot, [key]: value } : slot)),
    }));
  };

  const addSlot = () => {
    setDraft((current) => ({
      ...current,
      slots: [...current.slots, {
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        kind: "presenter",
        startAt: "",
        endAt: "",
        memberUid: "",
      }],
    }));
  };

  const removeSlot = (localId: string) => {
    setDraft((current) => ({
      ...current,
      slots: current.slots.filter((slot) => slot.localId !== localId),
    }));
  };

  const validateDraft = (): string | null => {
    if (!draft.date) return "発表日を入力してください";
    if (!draft.type.trim()) return "発表種別を入力してください";
    return null;
  };

  const handleSubmit = async () => {
    if (!isAdmin) {
      showToast("error", "管理者のみ発表日を編集できます");
      return;
    }

    const validationError = validateDraft();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    showToast("info", "APIが削除されたため、保存できません");
    resetForm();
  };

  return (
    <Container>
      <PageHeader
        title="発表"
        description="発表日を登録します"
        onBack={onBackToDashboard}
      />

      <Card style={{ maxWidth: "600px" }}>
        <Typography variant="h2" style={{ marginBottom: "var(--spacing-lg)" }}>発表日を登録</Typography>

        <div style={{ display: "grid", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
          <label style={labelStyle}>
            発表日
            <input
              type="date"
              value={draft.date}
              onChange={(event) => updateDraft("date", event.target.value)}
              style={nativeFieldStyle}
            />
          </label>

          <Input
            label="発表種別"
            value={draft.type}
            onChange={(value) => updateDraft("type", value)}
            placeholder="輪講 / 卒論 / 修論"
          />
        </div>

        <TextArea
          label="メモ（オプション）"
          value={draft.notes}
          onChange={(value) => updateDraft("notes", value)}
          placeholder="当日の注意事項など"
          rows={3}
          style={{ marginBottom: "var(--spacing-lg)" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
          <Typography variant="h3" style={{ marginBottom: 0 }}>予定スロット</Typography>
          {isAdmin && <Button variant="outline" size="sm" onClick={addSlot}>追加</Button>}
        </div>

        <div style={{ display: "grid", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
          {draft.slots.length === 0 && (
            <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
              予定はまだありません
            </Typography>
          )}

          {draft.slots.map((slot, index) => (
            <div key={slot.localId} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-main)", padding: "var(--spacing-md)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <Typography variant="body" style={{ fontWeight: 600, marginBottom: 0 }}>予定 {index + 1}</Typography>
                {isAdmin && <Button variant="ghost" size="sm" onClick={() => removeSlot(slot.localId)}>削除</Button>}
              </div>

              <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                <label style={labelStyle}>
                  種別
                  <select
                    value={slot.kind}
                    onChange={(event) => updateSlot(slot.localId, "kind", event.target.value)}
                    style={nativeFieldStyle}
                  >
                    {Object.entries(PRESENTATION_KIND_LABELS).map(([kind, label]) => (
                      <option key={kind} value={kind}>{label}</option>
                    ))}
                  </select>
                </label>

                <label style={labelStyle}>
                  開始時刻
                  <input
                    type="datetime-local"
                    value={slot.startAt}
                    onChange={(event) => updateSlot(slot.localId, "startAt", event.target.value)}
                    style={nativeFieldStyle}
                  />
                </label>

                <label style={labelStyle}>
                  終了時刻
                  <input
                    type="datetime-local"
                    value={slot.endAt}
                    onChange={(event) => updateSlot(slot.localId, "endAt", event.target.value)}
                    style={nativeFieldStyle}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {formError && (
          <div style={{ marginBottom: "var(--spacing-lg)", color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
            {formError}
          </div>
        )}

        {isAdmin && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)" }}>
            <Button variant="secondary" onClick={resetForm}>リセット</Button>
            <Button onClick={handleSubmit}>保存</Button>
          </div>
        )}
      </Card>
    </Container>
  );
}
