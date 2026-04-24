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

type ShortPresentationSlot = {
  startAt: string; // HH:MM format
  name: string;
};

type ShortPresentation = {
  id: string;
  date: string; // YYYY-MM-DD format
  slots: ShortPresentationSlot[];
};

type ShortPresentationDraft = {
  date: string;
  slots: Array<{ startAt: string; name: string }>;
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
  const [shortPresentations, setShortPresentations] = useState<ShortPresentation[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [presentationTypes, setPresentationTypes] = useState<string[]>([]);
  const [draft, setDraft] = useState<PresentationDraft>(createEmptyDraft);
  const [shortDraft, setShortDraft] = useState<ShortPresentationDraft>({ date: initialDateValue(), slots: [] });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [shortEditingId, setShortEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [shortFormOpen, setShortFormOpen] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const [shortFormError, setShortFormError] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<PresentationItem | null>(null);
  const [shortDeleteTarget, setShortDeleteTarget] = useState<ShortPresentation | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // API からデータを読み込む
      try {
        const presentationsResponse = await presentationsList();
        setPresentations(sortPresentationsDesc(presentationsResponse.data));
      } catch (error) {
        console.warn("presentationsList failed, using demo data:", error);
        // APIが失敗した場合はダミーデータ
        const mockPresentations: PresentationItem[] = [
          {
            id: "1",
            date: new Date().toISOString(),
            groupName: "射撃",
            type: "発表",
            slots: [{ kind: "presenter", startAt: new Date().toISOString(), endAt: new Date(Date.now() + 3600000).toISOString() }],
            notes: ""
          },
        ];
        setPresentations(sortPresentationsDesc(mockPresentations));
      }
      
      // メンバー情報を読み込む
      try {
        const membersResponse = await membersList();
        setMembers(membersResponse.data);
      } catch (error) {
        console.warn("membersList failed, using demo data:", error);
        const mockMembers: Member[] = [
          { uid: "user1", name: "テストユーザー", email: "test@example.com", isAdmin: true, grade: "1", groupName: "射撃" },
        ];
        setMembers(mockMembers);
      }
      
      // 設定から presentation types を読み込む
      try {
        const settingsResponse = await settingsGet();
        if (settingsResponse.data.presentationTypes) {
          setPresentationTypes(settingsResponse.data.presentationTypes);
        }
      } catch (error) {
        console.warn("settingsGet failed, using default types:", error);
        setPresentationTypes(["輪講", "卒論", "修論"]);
      }
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

  // 小発表用CRUD関数
  const resetShortForm = () => {
    setShortDraft({ date: initialDateValue(), slots: [] });
    setShortEditingId(null);
    setShortFormError("");
    setShortFormOpen(false);
  };

  const openShortCreateForm = () => {
    setShortDraft({ date: initialDateValue(), slots: [{ startAt: "09:00", name: "" }] });
    setShortEditingId(null);
    setShortFormError("");
    setShortFormOpen(true);
  };

  const openShortEditForm = (presentation: ShortPresentation) => {
    setShortDraft({ date: presentation.date, slots: [...presentation.slots] });
    setShortEditingId(presentation.id);
    setShortFormError("");
    setShortFormOpen(true);
  };

  const updateShortDraft = <K extends keyof ShortPresentationDraft>(key: K, value: ShortPresentationDraft[K]) => {
    setShortDraft((current) => ({ ...current, [key]: value }));
  };

  const updateShortSlot = (index: number, key: keyof ShortPresentationSlot, value: string) => {
    setShortDraft((current) => ({
      ...current,
      slots: current.slots.map((slot, i) => (i === index ? { ...slot, [key]: value } : slot)),
    }));
  };

  const addShortSlot = () => {
    setShortDraft((current) => ({
      ...current,
      slots: [...current.slots, { startAt: "09:00", name: "" }],
    }));
  };

  const removeShortSlot = (index: number) => {
    setShortDraft((current) => ({
      ...current,
      slots: current.slots.filter((_, i) => i !== index),
    }));
  };

  const validateShortDraft = (): string | null => {
    if (!shortDraft.date) return "日付を入力してください";
    if (shortDraft.slots.length === 0) return "1つ以上の時間を追加してください";
    if (shortDraft.slots.some((slot) => !slot.startAt.trim())) return "全ての時刻を入力してください";
    if (shortDraft.slots.some((slot) => !slot.name.trim())) return "全ての名前を入力してください";
    return null;
  };

  const handleShortSave = async () => {
    const error = validateShortDraft();
    if (error) {
      setShortFormError(error);
      return;
    }

    try {
      setSaving(true);
      setShortFormError("");

      if (shortEditingId) {
        // 既存を更新
        setShortPresentations((current) =>
          current.map((item) =>
            item.id === shortEditingId
              ? {
                  ...item,
                  date: shortDraft.date,
                  slots: shortDraft.slots,
                }
              : item
          )
        );
        showToast("success", "小発表を更新しました");
      } else {
        // 新規作成
        const newId = `short-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const newPresentation: ShortPresentation = {
          id: newId,
          date: shortDraft.date,
          slots: shortDraft.slots,
        };
        setShortPresentations((current) => [...current, newPresentation]);
        showToast("success", "小発表を作成しました");
      }

      resetShortForm();
    } finally {
      setSaving(false);
    }
  };

  const handleShortDelete = (presentation: ShortPresentation) => {
    setShortPresentations((current) => current.filter((item) => item.id !== presentation.id));
    setShortDeleteTarget(null);
    showToast("success", "小発表を削除しました");
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

      const presentationData = {
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

      if (editingId) {
        // 既存の日程を更新
        await presentationsUpdate({ id: editingId, presentation: presentationData });
        showToast("success", "日程を更新しました");
      } else {
        // 新しい日程を作成
        await presentationsCreate({ presentation: presentationData });
        showToast("success", "日程を作成しました");
      }

      // 最新データを再度読み込む
      const updatedPresentationsResponse = await presentationsList();
      setPresentations(sortPresentationsDesc(updatedPresentationsResponse.data));
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
      await presentationsDelete({ id: deleteTarget.id });
      showToast("success", "日程を削除しました");
      
      // 最新データを再度読み込む
      const updatedPresentationsResponse = await presentationsList();
      setPresentations(sortPresentationsDesc(updatedPresentationsResponse.data));
      
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

          {/* 小発表セクション */}
          <div style={{ marginBottom: "var(--spacing-lg)", marginTop: "var(--spacing-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: 0 }}>小発表</Typography>
            </div>
            {isAdmin && (
              <Button onClick={openShortCreateForm}>新しい日程を作成</Button>
            )}
          </div>

          <Card>
            <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
              {shortPresentations.length === 0 && (
                <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                  小発表の日程がまだ登録されていません
                </Typography>
              )}
              
              {shortPresentations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
                <div key={item.id} style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)", backgroundColor: "#f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "var(--spacing-md)" }}>
                    <Typography variant="h2" style={{ marginBottom: 0 }}>
                      {new Date(item.date + "T00:00").toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}
                    </Typography>
                    {isAdmin && (
                      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                        <Button variant="outline" size="sm" onClick={() => openShortEditForm(item)}>編集</Button>
                        <Button variant="outline" size="sm" onClick={() => setShortDeleteTarget(item)}>削除</Button>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: "grid", gap: "var(--spacing-xs)" }}>
                    {item.slots.map((slot, index) => (
                      <div key={index} style={{ display: "flex", gap: "var(--spacing-md)" }}>
                        <Typography variant="body" style={{ fontWeight: 600, minWidth: "60px" }}>
                          {slot.startAt}
                        </Typography>
                        <Typography variant="body" style={{ marginBottom: 0 }}>
                          {slot.name}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 小発表フォーム */}
          {shortFormOpen && (
            <Card style={{ marginTop: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-lg)" }}>
                <Typography variant="h2">{shortEditingId ? "小発表を編集" : "新しい小発表を作成"}</Typography>
                <Button variant="secondary" onClick={resetShortForm} disabled={saving}>閉じる</Button>
              </div>

              <div style={{ display: "grid", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                  <Typography variant="body" style={{ fontWeight: 600 }}>日付</Typography>
                  <input
                    type="date"
                    value={shortDraft.date}
                    onChange={(event) => updateShortDraft("date", event.target.value)}
                    style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <Typography variant="body" style={{ fontWeight: 600, marginBottom: "var(--spacing-md)" }}>時間ごとの発表者</Typography>
                <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
                  {shortDraft.slots.map((slot, index) => (
                    <div key={index} style={{ display: "grid", gridTemplateColumns: "80px 200px 80px", gap: "var(--spacing-md)", alignItems: "end" }}>
                      <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                        <Typography variant="body" style={{ fontSize: "var(--font-size-sm)" }}>時刻</Typography>
                        <input
                          type="time"
                          value={slot.startAt}
                          onChange={(event) => updateShortSlot(index, "startAt", event.target.value)}
                          style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                        />
                      </label>
                      <label style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
                        <Typography variant="body" style={{ fontSize: "var(--font-size-sm)" }}>名前</Typography>
                        <input
                          type="text"
                          value={slot.name}
                          onChange={(event) => updateShortSlot(index, "name", event.target.value)}
                          placeholder="発表者の名前"
                          style={{ padding: "var(--spacing-md)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-button)" }}
                        />
                      </label>
                      {shortDraft.slots.length > 1 && (
                        <Button variant="secondary" size="sm" onClick={() => removeShortSlot(index)}>削除</Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="secondary" style={{ marginTop: "var(--spacing-md)" }} onClick={addShortSlot}>時間を追加</Button>
              </div>

              {shortFormError && (
                <Typography variant="body" style={{ color: "var(--color-danger)", marginBottom: "var(--spacing-md)" }}>{shortFormError}</Typography>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)" }}>
                <Button variant="secondary" onClick={resetShortForm} disabled={saving}>キャンセル</Button>
                <Button onClick={handleShortSave} disabled={saving}>{saving ? "保存中..." : shortEditingId ? "更新する" : "作成する"}</Button>
              </div>
            </Card>
          )}

          {/* 小発表削除確認 */}
          {shortDeleteTarget && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <Card style={{ maxWidth: "400px" }}>
                <Typography variant="h3" style={{ marginBottom: "var(--spacing-md)" }}>小発表を削除しますか？</Typography>
                <Typography variant="body" style={{ marginBottom: "var(--spacing-lg)", color: "var(--color-text-sub)" }}>
                  {new Date(shortDeleteTarget.date + "T00:00").toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}の小発表は削除されます。
                </Typography>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)" }}>
                  <Button variant="secondary" onClick={() => setShortDeleteTarget(null)} disabled={saving}>キャンセル</Button>
                  <Button onClick={() => handleShortDelete(shortDeleteTarget)} disabled={saving} style={{ backgroundColor: "var(--color-danger)" }}>削除する</Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
