import React from "react";

interface PresentationSchedulerProps {
  onBackToDashboard: () => void;
}

export default function PresentationScheduler({ onBackToDashboard }: PresentationSchedulerProps) {
  // 仮の発表データ
  const presentations = [
    { id: 1, date: "2026年3月10日", presenter: "田中太郎", title: "機械学習による画像認識の研究", status: "予定" },
    { id: 2, date: "2026年3月17日", presenter: "佐藤花子", title: "量子コンピューティングの基礎", status: "予定" },
    { id: 3, date: "2026年3月24日", presenter: "鈴木一郎", title: "ブロックチェーン技術の応用", status: "予定" },
    { id: 4, date: "2026年2月24日", presenter: "山田次郎", title: "深層学習モデルの最適化", status: "完了" },
  ];

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

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>📊 発表スケジューラー</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>
        研究室メンバーの発表予定を管理します
      </p>

      <div style={{
        background: "white",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ fontSize: 20, marginBottom: 24 }}>発表予定一覧</h2>
        
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>日付</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>発表者</th>
              <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>タイトル</th>
              <th style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>状態</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "16px", fontSize: 14 }}>{p.date}</td>
                <td style={{ padding: "16px", fontSize: 14, fontWeight: "500" }}>{p.presenter}</td>
                <td style={{ padding: "16px", fontSize: 14 }}>{p.title}</td>
                <td style={{ padding: "16px", textAlign: "center" }}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    background: p.status === "完了" ? "#d1fae5" : "#dbeafe",
                    color: p.status === "完了" ? "#065f46" : "#1e40af",
                    fontWeight: "500"
                  }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 32, padding: 20, background: "#f9fafb", borderRadius: 8 }}>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            💡 今後の実装予定：発表の追加・編集・削除機能、通知機能など
          </p>
        </div>
      </div>
    </div>
  );
}
