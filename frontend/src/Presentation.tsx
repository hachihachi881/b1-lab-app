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

  const loadData = async () => {
    try {
      setLoading(true);
      const [presentationsResult, membersResult, settingsResult] = await Promise.all([
        presentationsList(),
        membersList(),
        settingsGet(),
      ]);

      if (presentationsResult.ok && presentationsResult.data) {
        setPresentations(sortPresentationsDesc(presentationsResult.data));
      }

      if (membersResult.ok && membersResult.data) {
        setMembers(membersResult.data);
      }

      if (settingsResult.ok && settingsResult.data) {
        setPresentationTypes(settingsResult.data.presentationTypes.items);
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

  const validateDraft = (): string | null => {
    if (!draft.date) return "発表日を入力してください";
    if (!draft.type.trim()) return "発表種別を入力してください";

    for (const slot of draft.slots) {
      if (!slot.startAt || !slot.endAt) {
        return "各予定の開始時刻と終了時刻を入力してください";
      }

      const start = new Date(slot.startAt);
      const end = new Date(slot.endAt);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "予定の時刻形式が正しくありません";
      }

      if (end <= start) {
        return "終了時刻は開始時刻より後にしてください";
      }

      if (slot.kind !== "break" && !slot.memberUid) {
        return "発表または司会の予定にはメンバーを設定してください";
      }
    }

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

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        date: draft.date,
        type: draft.type.trim(),
        notes: draft.notes.trim() || undefined,
        slots: draft.slots.map((slot) => ({
          kind: slot.kind,
          startAt: fromLocalDateTimeInputValue(slot.startAt),
          endAt: fromLocalDateTimeInputValue(slot.endAt),
          memberUid: slot.memberUid || undefined,
        })),
      };

      if (editingId) {
        await presentationsUpdate({ id: editingId, presentation: payload });
        showToast("success", "発表日を更新しました");
      } else {
        await presentationsCreate({ presentation: payload });
        showToast("success", "発表日を作成しました");
      }

      resetForm();
      await loadData();
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
      showToast("success", "発表日を削除しました");
      setDeleteTarget(null);
      if (editingId === deleteTarget.id) {
        resetForm();
      }
      await loadData();
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || adminLoading) {
    return (
      <Container>
        <PageHeader
          title="発表"
          description="研究室メンバーの発表予定を管理します"
          onBack={onBackToDashboard}
        />
        <LoadingSpinner text="発表予定を読み込み中..." />
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        title="発表"
        description="研究室メンバーの発表予定を管理します"
        onBack={onBackToDashboard}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <Card padding={24}>
          <Typography variant="caption" style={{ color: "var(--color-text-sub)", display: "block", marginBottom: 8 }}>登録済み発表日</Typography>
          <Typography variant="h2" margin="none">{presentations.length}件</Typography>
        </Card>
        <Card padding={24}>
          <Typography variant="caption" style={{ color: "var(--color-text-sub)", display: "block", marginBottom: 8 }}>今後の発表</Typography>
          <Typography variant="h2" margin="none">{upcomingCount}件</Typography>
        </Card>
        <Card padding={24}>
          <Typography variant="caption" style={{ color: "var(--color-text-sub)", display: "block", marginBottom: 8 }}>予定スロット総数</Typography>
          <Typography variant="h2" margin="none">{totalSlots}枠</Typography>
        </Card>
      </div>

      <Card style={{ marginBottom: "var(--spacing-lg)", background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-lg)", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <Typography variant="h2" style={{ marginBottom: 8 }}>発表日管理</Typography>
            <Typography variant="body" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
              発表日の一覧、時系列表示、詳細予定の登録をこの画面でまとめて管理できます。
            </Typography>
          </div>
          {isAdmin ? (
            <Button onClick={openCreateForm}>発表日を作成</Button>
          ) : (
            <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
              閲覧のみ可能です。編集は管理者アカウントで行ってください。
            </Typography>
          )}
        </div>
      </Card>

      {formOpen && (
        <Card style={{ marginBottom: "var(--spacing-lg)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", alignItems: "center", flexWrap: "wrap", marginBottom: "var(--spacing-lg)" }}>
            <div>
              <Typography variant="h2" style={{ marginBottom: 8 }}>{editingId ? "発表日を編集" : "新しい発表日を作成"}</Typography>
              <Typography variant="body" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                発表日そのものと、ダッシュボードカレンダーに出す予定枠を一緒に登録します。
              </Typography>
            </div>
            <Button variant="secondary" onClick={resetForm} disabled={saving}>閉じる</Button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>
              発表日
              <input
                type="date"
                value={draft.date}
                onChange={(event) => updateDraft("date", event.target.value)}
                style={nativeFieldStyle}
              />
            </label>

            <div>
              <Input
                label="発表種別"
                value={draft.type}
                onChange={(value) => updateDraft("type", value)}
                placeholder={presentationTypes[0] ?? "輪講 / 卒論 / 修論"}
                hint={presentationTypes.length > 0 ? `候補: ${presentationTypes.join(" / ")}` : "設定画面で発表種別を登録すると候補として使えます"}
              />
            </div>
          </div>

          <TextArea
            label="メモ"
            value={draft.notes}
            onChange={(value) => updateDraft("notes", value)}
            placeholder="当日の注意事項や発表テーマなど"
            rows={3}
            maxLength={400}
            style={{ marginBottom: "var(--spacing-lg)" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", alignItems: "center", flexWrap: "wrap", marginBottom: "var(--spacing-md)" }}>
            <div>
              <Typography variant="h3" style={{ marginBottom: 4 }}>発表予定</Typography>
              <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                ダッシュボードのカレンダーや当日進行に使う時間割です。
              </Typography>
            </div>
            <Button variant="outline" onClick={addSlot} disabled={saving}>予定を追加</Button>
          </div>

          <div style={{ display: "grid", gap: "var(--spacing-md)" }}>
            {draft.slots.length === 0 && (
              <div style={{ border: "1px dashed var(--color-border)", borderRadius: "var(--radius-main)", padding: "var(--spacing-lg)", color: "var(--color-text-sub)" }}>
                予定はまだありません。開始時刻と担当者を追加すると、ダッシュボードのカレンダーでも見やすく表示されます。
              </div>
            )}

            {draft.slots.map((slot, index) => (
              <div key={slot.localId} style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-main)", padding: "var(--spacing-md)", backgroundColor: "#fbfdff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                  <Typography variant="h3" style={{ marginBottom: 0 }}>予定 {index + 1}</Typography>
                  <Button variant="ghost" size="sm" onClick={() => removeSlot(slot.localId)} disabled={saving}>削除</Button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--spacing-md)" }}>
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
                    メンバー
                    <select
                      value={slot.memberUid}
                      onChange={(event) => updateSlot(slot.localId, "memberUid", event.target.value)}
                      style={nativeFieldStyle}
                      disabled={slot.kind === "break"}
                    >
                      <option value="">{slot.kind === "break" ? "休憩なので不要" : "選択してください"}</option>
                      {members.map((member) => (
                        <option key={member.uid} value={member.uid}>{member.name}</option>
                      ))}
                    </select>
                  </label>

                  <label style={labelStyle}>
                    開始
                    <input
                      type="datetime-local"
                      value={slot.startAt}
                      onChange={(event) => updateSlot(slot.localId, "startAt", event.target.value)}
                      style={nativeFieldStyle}
                    />
                  </label>

                  <label style={labelStyle}>
                    終了
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
            <div style={{ marginTop: "var(--spacing-md)", color: "var(--color-danger)", fontSize: "var(--font-size-sm)" }}>
              {formError}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
            <Button variant="secondary" onClick={resetForm} disabled={saving}>キャンセル</Button>
            <Button onClick={handleSubmit} disabled={saving}>{saving ? "保存中..." : editingId ? "更新する" : "作成する"}</Button>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--spacing-lg)", alignItems: "start" }}>
        <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
          <Card>
            <Typography variant="h2">発表日の時系列表示</Typography>
            <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
              新しい発表日から順に、予定の詳細まで確認できます。
            </Typography>

            <div style={{ display: "grid", gap: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
              {timelineItems.length === 0 && (
                <Typography variant="body" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                  発表日はまだ登録されていません。
                </Typography>
              )}

              {timelineItems.map((item) => (
                <div key={item.id} style={{ position: "relative", padding: "0 0 0 24px", borderLeft: "2px solid #dbeafe" }}>
                  <div style={{ position: "absolute", left: -7, top: 8, width: 12, height: 12, borderRadius: 999, background: "var(--color-primary)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", flexWrap: "wrap", alignItems: "center" }}>
                    <div>
                      <Typography variant="caption" style={{ color: "var(--color-primary)", fontWeight: 700, display: "block", marginBottom: 6 }}>
                        {formatPresentationDate(item.date)}
                      </Typography>
                      <Typography variant="h3" style={{ marginBottom: 4 }}>{item.type}</Typography>
                      <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                        {getPresentationTimeRangeLabel(item)} ・ {item.slots.length}枠
                      </Typography>
                    </div>
                    {isAdmin && (
                      <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                        <Button variant="outline" size="sm" onClick={() => openEditForm(item)}>編集</Button>
                        <Button variant="danger" size="sm" onClick={() => setDeleteTarget(item)}>削除</Button>
                      </div>
                    )}
                  </div>

                  {item.notes && (
                    <Typography variant="body" style={{ color: "var(--color-text-sub)", marginTop: 12, marginBottom: 12 }}>
                      {item.notes}
                    </Typography>
                  )}

                  <div style={{ display: "grid", gap: "var(--spacing-sm)", marginTop: "var(--spacing-md)" }}>
                    {sortSlots(item.slots).length === 0 && (
                      <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                        詳細な予定は未登録です。
                      </Typography>
                    )}
                    {sortSlots(item.slots).map((slot, slotIndex) => (
                      <div key={`${item.id}-${slotIndex}`} style={{ display: "flex", justifyContent: "space-between", gap: "var(--spacing-md)", alignItems: "center", padding: "10px 12px", backgroundColor: "#f8fafc", borderRadius: "var(--radius-button)", flexWrap: "wrap" }}>
                        <div>
                          <Typography variant="body" style={{ marginBottom: 4, fontWeight: 600 }}>
                            {PRESENTATION_KIND_LABELS[slot.kind]}
                            {slot.memberUid ? ` / ${memberNameByUid[slot.memberUid] ?? slot.memberUid}` : ""}
                          </Typography>
                          <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                            {formatPresentationDateTime(slot.startAt)} - {new Date(slot.endAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Typography variant="h2">発表日一覧表示</Typography>
            <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
              リスト形式で全件を素早く確認できます。並び順は新しい日付が先です。
            </Typography>

            <div style={{ marginTop: "var(--spacing-lg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-main)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 80px", gap: "var(--spacing-md)", padding: "12px 16px", backgroundColor: "#f8fafc", fontSize: "var(--font-size-sm)", fontWeight: 700, color: "var(--color-text-sub)" }}>
                <span>発表日</span>
                <span>種別</span>
                <span>予定</span>
                <span>枠数</span>
              </div>
              {listItems.map((item) => (
                <div key={`row-${item.id}`} style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.8fr 80px", gap: "var(--spacing-md)", padding: "14px 16px", borderTop: "1px solid var(--color-border)", alignItems: "center" }}>
                  <span>{formatPresentationDate(item.date)}</span>
                  <span>{item.type}</span>
                  <span>{getPresentationTimeRangeLabel(item)}</span>
                  <span>{item.slots.length}</span>
                </div>
              ))}
              {listItems.length === 0 && (
                <div style={{ padding: "20px 16px", color: "var(--color-text-sub)" }}>表示できる発表日がありません。</div>
              )}
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "var(--spacing-lg)" }}>
          <Card>
            <Typography variant="h2">予定登録カレンダー</Typography>
            <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
              当月の発表日を一覧できる簡易カレンダーです。ダッシュボードにも同じ予定が反映されます。
            </Typography>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, marginTop: "var(--spacing-lg)" }}>
              {["日", "月", "火", "水", "木", "金", "土"].map((day) => (
                <div key={day} style={{ textAlign: "center", fontSize: "var(--font-size-sm)", color: "var(--color-text-sub)", fontWeight: 700 }}>{day}</div>
              ))}
              {currentMonthDays.map((day) => {
                const dayItems = presentationsByDate[day.key] ?? [];
                const isToday = day.key === toDateKey(new Date());
                return (
                  <div
                    key={day.key}
                    style={{
                      minHeight: 92,
                      borderRadius: "var(--radius-button)",
                      padding: 10,
                      border: isToday ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      backgroundColor: dayItems.length > 0 ? "#eff6ff" : day.inMonth ? "white" : "#f8fafc",
                      opacity: day.inMonth ? 1 : 0.55,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 700 }}>{day.date.getDate()}</span>
                      {dayItems.length > 0 && (
                        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-primary)", fontWeight: 700 }}>{dayItems.length}件</span>
                      )}
                    </div>
                    <div style={{ display: "grid", gap: 4 }}>
                      {dayItems.slice(0, 2).map((item) => (
                        <div key={`calendar-${item.id}`} style={{ fontSize: "var(--font-size-xs)", padding: "4px 6px", borderRadius: 6, backgroundColor: "white", color: "var(--color-text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.type}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <Typography variant="h2">直近の発表予定</Typography>
            <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
              ダッシュボードカレンダーで目立つ予定を先に確認できます。
            </Typography>

            <div style={{ display: "grid", gap: "var(--spacing-md)", marginTop: "var(--spacing-lg)" }}>
              {timelineItems.slice(0, 5).map((item) => (
                <div key={`upcoming-${item.id}`} style={{ padding: "14px 16px", border: "1px solid var(--color-border)", borderRadius: "var(--radius-main)" }}>
                  <Typography variant="caption" style={{ color: "var(--color-primary)", display: "block", marginBottom: 8 }}>
                    {formatPresentationDateShort(item.date)}
                  </Typography>
                  <Typography variant="body" style={{ fontWeight: 700, marginBottom: 4 }}>{item.type}</Typography>
                  <Typography variant="caption" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                    {getPresentationTimeRangeLabel(item)}
                  </Typography>
                </div>
              ))}
              {timelineItems.length === 0 && (
                <Typography variant="body" style={{ color: "var(--color-text-sub)", marginBottom: 0 }}>
                  直近の発表予定はありません。
                </Typography>
              )}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="発表日を削除"
        message={deleteTarget ? `${formatPresentationDate(deleteTarget.date)} の発表日を削除します。元に戻せません。` : ""}
        confirmText="削除する"
        confirmVariant="danger"
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Container>
  );
}
