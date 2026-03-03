import React from "react";

interface EventsProps {
  onBackToDashboard: () => void;
}

export default function Events({ onBackToDashboard }: EventsProps) {
  // 仮のイベントデータ
  const events = [
    { 
      id: 1, 
      date: "2026年3月15日", 
      title: "研究室交流会", 
      location: "4F 輪講室",
      description: "他研究室との交流イベント",
      type: "交流"
    },
    { 
      id: 2, 
      date: "2026年3月20日", 
      title: "特別講演会", 
      location: "大講義室",
      description: "外部講師による最新技術の講演",
      type: "講演"
    },
    { 
      id: 3, 
      date: "2026年4月5日", 
      title: "新入生歓迎会", 
      location: "未定",
      description: "新しいメンバーを迎える歓迎イベント",
      type: "交流"
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "交流": return { bg: "#dbeafe", color: "#1e40af" };
      case "講演": return { bg: "#fce7f3", color: "#9f1239" };
      default: return { bg: "#f3f4f6", color: "#374151" };
    }
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1400, margin: "0 auto" }}>
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

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>🎉 イベント</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>
        研究室の各種イベント情報
      </p>

      <div style={{ display: "grid", gap: 24 }}>
        {events.map(event => {
          const typeStyle = getTypeColor(event.type);
          return (
            <div
              key={event.id}
              style={{
                background: "white",
                padding: 24,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #3b82f6"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: 20, marginBottom: 8, color: "#111827" }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
                    📅 {event.date}
                  </p>
                  <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
                    📍 {event.location}
                  </p>
                </div>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: typeStyle.bg,
                  color: typeStyle.color,
                  fontWeight: "500"
                }}>
                  {event.type}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
                {event.description}
              </p>
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: 32, 
        padding: 20, 
        background: "#f9fafb", 
        borderRadius: 8,
        textAlign: "center"
      }}>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          💡 今後の実装予定：イベントの追加・編集・削除機能、参加者管理など
        </p>
      </div>
    </div>
  );
}
