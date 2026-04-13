import React, { useEffect, useMemo, useState } from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Button, Card, ConfirmModal, Input, LoadingSpinner, TextArea, Typography, useToast } from "./components";
import { useAdmin } from "./hooks/useAdmin";
import {
  buildCalendarDays,
  formatPresentationDate,
  formatPresentationDateShort,
  formatPresentationDateTime,
  fromLocalDateTimeInputValue,
  getPresentationTimeRangeLabel,
  PRESENTATION_KIND_LABELS,
  sortPresentationsDesc,
  sortSlots,
  toDateKey,
  toLocalDateTimeInputValue,
} from "./lib/presentations";
import { classifyError } from "./utils/errorHandler";
import { membersList, Member } from "./services/members/membersService";
import {
  Presentation as PresentationItem,
  presentationsCreate,
  presentationsDelete,
  presentationsList,
  presentationsUpdate,
} from "./services/presentations/presentationsService";
import { settingsGet } from "./services/settings/settingsService";

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
  groupName: string;
  startAt: string;
  slots: PresentationSlotDraft[];
};

const initialDateValue = () => toDateKey(new Date());

const createSlotDraft = (date: string, previousEndAt?: string): PresentationSlotDraft => {
  const baseStart = previousEndAt ? new Date(previousEndAt) : new Date(`${date}T13:00`);
  const baseEnd = new Date(baseStart);
  if (!previousEndAt) {
    baseEnd.setMinutes(baseEnd.getMinutes() + 20);
  } else {
    baseEnd.setMinutes(baseStart.getMinutes() + 20);
  }

  return {
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind: "presenter",
    startAt: toLocalDateTimeInputValue(baseStart.toISOString()),
    endAt: toLocalDateTimeInputValue(baseEnd.toISOString()),
    memberUid: "",
  };
};

const createEmptyDraft = (): PresentationDraft => ({
  date: initialDateValue(),
  type: "",
  notes: "",
  groupName: "",
  startAt: "",
  slots: [],
});

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

function toDraft(presentation: PresentationItem): PresentationDraft {
  return {
    date: toDateKey(presentation.date),
    type: presentation.type,
    notes: presentation.notes ?? "",
    groupName: presentation.groupName,
    startAt: presentation.slots[0]?.startAt ?? "",
    slots: sortSlots(presentation.slots).map((slot, index) => ({
      localId: `${presentation.id}-${index}`,
      kind: slot.kind,
      startAt: toLocalDateTimeInputValue(slot.startAt),
      endAt: toLocalDateTimeInputValue(slot.endAt),
      memberUid: slot.memberUid ?? "",
    })),
  };
}

export default function Presentation({ onBackToDashboard }: PresentationProps) {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [presentations, setPresentations] = useState<PresentationItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [presentationTypes, setPresentationTypes] = useState<string[]>([]);
  const [draft, setDraft] = useState<PresentationDraft>(createEmptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<PresentationItem | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    // presentations が変更されたら localStorage に保存
    if (presentations.length > 0) {
      localStorage.setItem("presentations_dev", JSON.stringify(presentations));
    }
  }, [presentations]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // localStorage から読み込む
      const saved = localStorage.getItem("presentations_dev");
      if (saved) {
        const parsedData = JSON.parse(saved);
        setPresentations(sortPresentationsDesc(parsedData));
      } else {
        // 初回は開発環境用ダミーデータ
        const mockPresentations: PresentationItem[] = [
          {
            id: "1",
            date: new Date().toISOString(),
            groupName: "射撃",
            type: "発表",
            slots: [{ kind: "presenter", startAt: new Date().toISOString(), endAt: new Date(Date.now() + 3600000).toISOString() }],
            notes: ""
          },
          {
            id: "2",
            date: new Date(Date.now() + 86400000).toISOString(),
            groupName: "剣術",
            type: "発表",
            slots: [{ kind: "presenter", startAt: new Date(Date.now() + 86400000).toISOString(), endAt: new Date(Date.now() + 86400000 + 3600000).toISOString() }],
            notes: ""
          },
        ];
        setPresentations(sortPresentationsDesc(mockPresentations));
      }

      const mockMembers: Member[] = [
        { uid: "user1", name: "山田太郎" },
        { uid: "user2", name: "鈴木花子" },
      ];

      setMembers(mockMembers);
      setPresentationTypes(["輪講", "卒論", "修論"]);
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const memberNameByUid = useMemo(() => {
    return members.reduce<Record<string, string>>((accumulator, member) => {
      accumulator[member.uid] = member.name;
      return accumulator;
    }, {});
  }, [members]);

  const upcomingCount = useMemo(() => {
    const todayKey = toDateKey(new Date());
    return presentations.filter((item) => toDateKey(item.date) >= todayKey).length;
  }, [presentations]);

  const totalSlots = useMemo(() => {
    return presentations.reduce((sum, item) => sum + item.slots.length, 0);
  }, [presentations]);

  const presentationsByDate = useMemo(() => {
    return presentations.reduce<Record<string, PresentationItem[]>>((accumulator, item) => {
      const key = toDateKey(item.date);
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(item);
      return accumulator;
    }, {});
  }, [presentations]);

  const timelineItems = useMemo(() => sortPresentationsDesc(presentations), [presentations]);
  const listItems = useMemo(() => sortPresentationsDesc(presentations), [presentations]);
  const currentMonthDays = useMemo(() => buildCalendarDays(new Date()), []);

  const resetForm = () => {
    setDraft(createEmptyDraft());
    setEditingId(null);
    setFormError("");
    setFormOpen(false);
  };

  const openCreateForm = () => {
    setDraft(createEmptyDraft());
    setEditingId(null);
    setFormError("");
    setFormOpen(true);
  };

  const openEditForm = (presentation: PresentationItem) => {
    setDraft(toDraft(presentation));
    setEditingId(presentation.id);
    setFormError("");
    setFormOpen(true);
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
    setDraft((current) => {
      const previous = current.slots[current.slots.length - 1];
      return {
        ...current,
        slots: [...current.slots, createSlotDraft(current.date, previous?.endAt ? fromLocalDateTimeInputValue(previous.endAt) : undefined)],
      };
    });
  };

  const removeSlot = (localId: string) => {
    setDraft((current) => ({
      ...current,
      slots: current.slots.filter((slot) => slot.localId !== localId),
    }));
  };

  const validateDraft = (): string | null => {
    if (!draft.groupName.trim()) return "グループを選択してください";
    if (!draft.date) return "発表日を入力してください";
    if (!draft.startAt) return "開始時刻を入力してください";

    return null;
  };

  const handleSave = async () => {
    const error = validateDraft();
    if (error) {
      setFormError(error);
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      if (editingId) {
        // 既存の日程を更新
        setPresentations((current) =>
          current.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  date: draft.date,
                  type: draft.type || "発表",
                  groupName: draft.groupName,
                  notes: draft.notes.trim() || undefined,
                  slots: draft.startAt ? [{
                    kind: "presenter" as const,
                    startAt: draft.startAt,
                    endAt: new Date(new Date(draft.startAt).getTime() + 3600000).toISOString(),
                  }] : item.slots,
                }
              : item
          )
        );
        showToast("success", "日程を更新しました");
      } else {
        // 新しい日程を作成
        const newPresentation: PresentationItem = {
          id: `${Date.now()}`,
          date: draft.date,
          type: draft.type || "発表",
          groupName: draft.groupName,
          notes: draft.notes.trim() || undefined,
          slots: draft.startAt ? [{
            kind: "presenter" as const,
            startAt: draft.startAt,
            endAt: new Date(new Date(draft.startAt).getTime() + 3600000).toISOString(),
          }] : [],
        };
        setPresentations((current) => [newPresentation, ...current]);
        showToast("success", "日程を作成しました");
      }

      resetForm();
    } catch (error) {
      const message = classifyError(error).message;
      setFormError(message);
      showToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setSaving(true);
      setPresentations((current) => current.filter((item) => item.id !== deleteTarget.id));
      showToast("success", "日程を削除しました");
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) {
        resetForm();
      }
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container>
      <PageHeader
        title="発表"
        description="報告会の日程を管理します"
        onBack={onBackToDashboard}
      />
      
      {loading || adminLoading ? (
        <LoadingSpinner text="データを読み込み中..." />
      ) : (
        <>
          <div style={{ marginBottom: "var(--spacing-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: 0 }}>報告会</Typography>
            </div>
            {isAdmin && (
              <Button onClick={openCreateForm}>新しい日程を作成</Button>
            )}
          </div>

          <Card>
            <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
              {["射撃", "剣術", "格闘"].map((groupName) => {
                const groupPresentations = presentations.filter((p) => p.groupName === groupName).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                return (
                  <div key={groupName}>
                    <Typography variant="h3" style={{ marginBottom: "var(--spacing-md)" }}>{groupName}</Typography>
                    
                    <div style={{ display: "grid", gap: "var(--spacing-sm)" }}>
                      {groupPresentations.length === 0 && (
                        <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                          報告会の日程がまだ登録されていません
                        </Typography>
                      )}
                      
                      {groupPresentations.map((item) => (
                        <div key={item.id} style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "var(--spacing-md)" }}>
                          <div>
                            <Typography variant="h3" style={{ marginBottom: "var(--spacing-xs)" }}>
                              {new Date(item.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                              {item.slots[0]?.startAt && ` ${new Date(item.slots[0].startAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`}
                            </Typography>
                            <Typography variant="body" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                              {item.slots.length}枠
                            </Typography>
                          </div>
                          {isAdmin && (
                            <Button variant="outline" size="sm" onClick={() => openEditForm(item)}>編集</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {formOpen && (
            <Card style={{ marginTop: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-lg)" }}>
                <Typography variant="h2">{editingId ? "日程を編集" : "新しい日程を作成"}</Typography>
                <Button variant="secondary" onClick={resetForm} disabled={saving}>閉じる</Button>
              </div>

              <div style={{ display: "grid", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                  <Typography variant="body" style={{ fontWeight: 600 }}>グループ</Typography>
                  <select
                    value={draft.groupName}
                    onChange={(event) => updateDraft("groupName", event.target.value)}
                    style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                  >
                    <option value="">選択してください</option>
                    <option value="射撃">射撃</option>
                    <option value="剣術">剣術</option>
                    <option value="格闘">格闘</option>
                  </select>
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                  <Typography variant="body" style={{ fontWeight: 600 }}>日付</Typography>
                  <input
                    type="date"
                    value={draft.date}
                    onChange={(event) => updateDraft("date", event.target.value)}
                    style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                  <Typography variant="body" style={{ fontWeight: 600 }}>開始時刻</Typography>
                  <input
                    type="datetime-local"
                    value={draft.startAt}
                    onChange={(event) => updateDraft("startAt", event.target.value)}
                    style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                  />
                </label>
              </div>

              {formError && (
                <Typography variant="body" style={{ color: "var(--color-danger)", marginBottom: "var(--spacing-md)" }}>{formError}</Typography>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)" }}>
                <Button variant="secondary" onClick={resetForm} disabled={saving}>キャンセル</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? "保存中..." : editingId ? "更新する" : "作成する"}</Button>
              </div>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
