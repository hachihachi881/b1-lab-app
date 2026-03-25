import React, { useEffect, useMemo, useState } from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Card, LoadingSpinner, Typography, useToast, Input, Button } from "./components";
import {
  formatPresentationDate,
  sortPresentationsDesc,
  toDateKey,
} from "./lib/presentations";
import { classifyError } from "./utils/errorHandler";
import {
  Presentation as PresentationItem,
  presentationsList,
  presentationsUpdate,
} from "./services/presentations/presentationsService";
import {
  settingsGet,
  settingsUpdate,
  Settings,
} from "./services/settings/settingsService";

interface PresentationProps {
  onBackToDashboard: () => void;
}

export default function Presentation({ onBackToDashboard }: PresentationProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [presentations, setPresentations] = useState<PresentationItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingDate, setEditingDate] = useState<string>("");
  const [editingGroupName, setEditingGroupName] = useState<string | null>(null);
  const [editingGroupNameValue, setEditingGroupNameValue] = useState<string>("");
  const [editingGroupForDates, setEditingGroupForDates] = useState<string | null>(null);
  const [editingDates, setEditingDates] = useState<Record<string, string>>({});

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [presentationsResult, settingsResult] = await Promise.all([
        presentationsList(),
        settingsGet(),
      ]);
      
      if (presentationsResult.ok && presentationsResult.data) {
        setPresentations(sortPresentationsDesc(presentationsResult.data));
      }
      
      if (settingsResult.ok && settingsResult.data) {
        setSettings(settingsResult.data);
      }
    } catch (error) {
      showToast("error", classifyError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const presentationsByDate = useMemo(() => {
    const grouped = presentations.reduce<Record<string, PresentationItem[]>>((acc, item) => {
      const dateKey = toDateKey(item.date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});

    // 各日付内のグループを時間でソート（早い順）
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].sort((a, b) => a.date.localeCompare(b.date));
    });

    return grouped;
  }, [presentations]);

  const getGroupDisplayName = (groupId: string): string => {
    return settings?.groupDisplayNames?.[groupId] || groupId;
  };

  const handleUpdateDate = async (id: string, newDate: string) => {
    if (!newDate) return;
    
    try {
      await presentationsUpdate({
        id,
        presentation: { date: newDate },
      });
      showToast("success", "日付を更新しました");
      setEditingId(null);
      await loadData();
    } catch (error) {
      showToast("error", classifyError(error).message);
    }
  };

  const handleUpdateGroupName = async (groupId: string, newName: string) => {
    if (!newName) {
      showToast("error", "グループ名を入力してください");
      return;
    }

    try {
      const updatedGroupDisplayNames = {
        ...settings?.groupDisplayNames,
        [groupId]: newName,
      };

      console.log("Updating group display name:", { groupId, newName, updated: updatedGroupDisplayNames });

      await settingsUpdate({ groupDisplayNames: updatedGroupDisplayNames });
      showToast("success", `${groupId}を「${newName}」に更新しました`);
      setEditingGroupName(null);
      await loadData();
    } catch (error) {
      console.error("グループ名更新エラー:", error);
      showToast("error", classifyError(error).message);
    }
  };

  const handleAddTestData = async () => {
    try {
      // Test data for one date with groups A, B, C
      const testDataList = [
        {
          date: "2024-03-25T14:30:00",
          groupName: "A",
          type: "researchPresentation",
          notes: "射撃グループの発表",
          slots: [{ startAt: "14:30:00", endAt: "15:00:00", kind: "presenter" }],
        },
        {
          date: "2024-03-25T15:30:00",
          groupName: "B",
          type: "researchPresentation",
          notes: "格闘グループの発表",
          slots: [{ startAt: "15:30:00", endAt: "16:00:00", kind: "presenter" }],
        },
        {
          date: "2024-03-25T16:00:00",
          groupName: "C",
          type: "researchPresentation",
          notes: "剣術グループの発表",
          slots: [{ startAt: "16:00:00", endAt: "16:30:00", kind: "presenter" }],
        },
      ];

      // Get the presentations collection and add documents
      const db = (await import("./lib/firebase")).db;
      const { addDoc, collection } = await import("firebase/firestore");
      
      for (const data of testDataList) {
        await addDoc(collection(db, "presentations"), {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      showToast("success", "テストデータを追加しました");
      await loadData();
    } catch (error) {
      console.error("テストデータ追加エラー:", error);
      showToast("error", classifyError(error).message);
    }
  };

  const handleSaveGroupEdits = async (date: string) => {
    try {
      // Save group name if edited
      if (editingGroupName && editingGroupNameValue) {
        const updatedGroupDisplayNames = {
          ...settings?.groupDisplayNames,
          [editingGroupName]: editingGroupNameValue,
        };
        await settingsUpdate({ groupDisplayNames: updatedGroupDisplayNames });
      }

      // Save time updates
      const dateItems = presentations.filter(p => toDateKey(p.date) === date);
      const updatePromises = dateItems
        .filter(item => editingDates[item.id] && editingDates[item.id] !== item.date)
        .map(item => {
          const newDate = editingDates[item.id];
          // Ensure date format is YYYY-MM-DDTHH:mm:ss (with seconds)
          let formattedDate = newDate;
          if (!formattedDate.includes('T')) {
            // If only date provided, add midnight time
            formattedDate = `${formattedDate}T00:00:00`;
          } else if (!formattedDate.match(/T\d{2}:\d{2}:\d{2}/)) {
            // If HH:mm but missing seconds, add :00
            formattedDate = `${formattedDate}:00`;
          }
          console.log("Saving date update:", { id: item.id, from: item.date, to: formattedDate });
          return presentationsUpdate({
            id: item.id,
            presentation: { date: formattedDate },
          });
        });

      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }

      showToast("success", "変更を保存しました");
      setEditingGroupForDates(null);
      setEditingDates({});
      setEditingGroupName(null);
      setEditingGroupNameValue("");
      await loadData();
    } catch (error) {
      console.error("変更保存エラー:", error);
      showToast("error", classifyError(error).message);
    }
  };

  if (loading) {
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

      {presentations.length === 0 && (
        <Button 
          variant="outline" 
          onClick={handleAddTestData}
          style={{ marginBottom: "var(--spacing-lg)" }}
        >
          テストデータを追加
        </Button>
      )}

      {Object.entries(presentationsByDate)
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, items]) => (
          <Card key={date} style={{ marginBottom: "var(--spacing-lg)" }}>
            {editingGroupForDates === date ? (
              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <Typography variant="body" style={{ fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
                    日付
                  </Typography>
                  <Input
                    type="date"
                    value={date}
                    onChange={(newDateValue) => {
                      // When date is changed, update all items for this date
                      const updatedDates: Record<string, string> = {};
                      items.forEach((item) => {
                        const currentDateTime = editingDates[item.id] || item.date;
                        // Extract time portion from current value
                        const timeMatch = currentDateTime.match(/T(\d{2}:\d{2})/);
                        const time = timeMatch ? timeMatch[1] : "00:00";
                        // Create new datetime with new date and existing time
                        updatedDates[item.id] = `${newDateValue}T${time}:00`;
                      });
                      setEditingDates(updatedDates);
                      console.log("Date changed:", { from: date, to: newDateValue, updatedDates });
                    }}
                    style={{ marginBottom: "var(--spacing-md)" }}
                  />
                </div>
                <div style={{ marginBottom: "var(--spacing-md)" }}>
                  <Typography variant="body" style={{ fontWeight: "bold", marginBottom: "var(--spacing-sm)" }}>
                    グループと時間
                  </Typography>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-md)" }}>
                    {items.map((item) => {
                      const getEditTimeValue = (itemId: string) => {
                        const currentEditValue = editingDates[itemId];
                        if (currentEditValue) {
                          const match = currentEditValue.match(/T(\d{2}:\d{2})/);
                          return match ? match[1] : "00:00";
                        }
                        const startAt = item.slots[0]?.startAt;
                        if (!startAt) return "00:00";
                        const timeStr = typeof startAt === 'string' ? startAt : "";
                        return timeStr.substring(0, 5);
                      };
                      return (
                        <div key={item.id} style={{ 
                          padding: "var(--spacing-md)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-main)",
                          backgroundColor: "#fbfdff",
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-sm)"
                        }}>
                          {editingGroupName === item.groupName ? (
                            <Input
                              type="text"
                              value={editingGroupNameValue}
                              onChange={(value) => setEditingGroupNameValue(value)}
                              placeholder="グループ名"
                            />
                          ) : (
                            <div 
                              onClick={() => {
                                setEditingGroupName(item.groupName);
                                setEditingGroupNameValue(getGroupDisplayName(item.groupName));
                              }}
                              style={{ 
                                padding: "var(--spacing-md)",
                                backgroundColor: "var(--color-bg-sub)",
                                borderRadius: "var(--radius-button)",
                                cursor: "pointer",
                                border: "1px solid var(--color-border)",
                                textAlign: "center",
                                fontWeight: "bold"
                              }}
                            >
                              {getGroupDisplayName(item.groupName)}
                            </div>
                          )}
                          <Input
                            type="time"
                            value={getEditTimeValue(item.id)}
                            onChange={(value) => {
                              console.log("Time onChange triggered:", { value, itemId: item.id });
                              if (item.slots[0]) {
                                const newDate = `${date}T${value}:00`;
                                console.log("Time input changed:", { date, value, newDate, itemId: item.id });
                                setEditingDates(prev => {
                                  const updated = { ...prev, [item.id]: newDate };
                                  console.log("EditingDates updated:", updated);
                                  return updated;
                                });
                              }
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "var(--spacing-sm)" }}>
                  <Button variant="primary" onClick={() => handleSaveGroupEdits(date)}>
                    保存
                  </Button>
                  <Button variant="secondary" onClick={() => {
                    setEditingGroupForDates(null);
                    setEditingDates({});
                    setEditingGroupName(null);
                    setEditingGroupNameValue("");
                  }}>
                    キャンセル
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
                  <Typography variant="h2" style={{ margin: 0 }}>
                    報告会 {date}
                  </Typography>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingGroupForDates(date);
                      const dateMap: Record<string, string> = {};
                      items.forEach((item) => {
                        dateMap[item.id] = item.date;
                      });
                      setEditingDates(dateMap);
                    }}
                  >
                    編集
                  </Button>
                </div>
                {items.length === 0 ? (
                  <Typography variant="body" style={{ color: "var(--color-text-sub)" }}>
                    登録済みの発表がありません。
                  </Typography>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--spacing-md)" }}>
                    {items.map((item) => {
                      const getStartTime = (itemDate: string) => {
                        if (!itemDate) return "未設定";
                        const match = itemDate.match(/T(\d{2}:\d{2})/);
                        return match ? match[1] : "未設定";
                      };
                      const startTime = getStartTime(item.date);
                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: "var(--spacing-md)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-main)",
                            backgroundColor: "#fbfdff",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center"
                          }}
                        >
                          <Typography variant="h3" style={{ marginBottom: 4 }}>
                            {getGroupDisplayName(item.groupName)}
                          </Typography>
                          <Typography variant="h2" style={{ color: "var(--color-text-sub)", marginBottom: 0, fontSize: "1.5em" }}>
                            {startTime}~
                          </Typography>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
    </Container>
  );
}
