import React from "react";

interface TeaPartyBlogProps {
  onBackToDashboard: () => void;
}

export default function TeaPartyBlog({ onBackToDashboard }: TeaPartyBlogProps) {
  // 仮のお茶会記録データ
  const teaPartyPosts = [
    {
      id: 1,
      date: "2026年2月20日",
      title: "第17回 お茶会",
      group: "グループA",
      content: "今回のお茶会では、最近の研究進捗について情報交換を行いました。特に機械学習の最新トレンドについて活発な議論が交わされました。",
      photos: "📷 写真3枚"
    },
    {
      id: 2,
      date: "2026年2月6日",
      title: "第16回 お茶会",
      group: "グループB",
      content: "新年最初のお茶会。今年の目標や研究計画について話し合いました。和やかな雰囲気の中、メンバー間の親睦を深めることができました。",
      photos: "📷 写真5枚"
    },
    {
      id: 3,
      date: "2026年1月23日",
      title: "第15回 お茶会",
      group: "グループC",
      content: "年末の振り返りと研究発表の準備状況について共有しました。先輩からのアドバイスも多数いただき、有意義な時間となりました。",
      photos: "📷 写真4枚"
    },
  ];

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

      <h1 style={{ fontSize: 28, marginBottom: 8 }}>☕ お茶会ブログ</h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40 }}>
        研究室お茶会の記録と思い出
      </p>

      <div style={{ display: "grid", gap: 24 }}>
        {teaPartyPosts.map(post => (
          <div
            key={post.id}
            style={{
              background: "white",
              padding: 32,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ fontSize: 22, color: "#111827", margin: 0 }}>
                  {post.title}
                </h2>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 12,
                  fontSize: 12,
                  background: "#fef3c7",
                  color: "#92400e",
                  fontWeight: "500"
                }}>
                  {post.group}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                📅 {post.date}
              </p>
            </div>

            <p style={{ 
              fontSize: 15, 
              color: "#374151", 
              lineHeight: 1.8,
              marginBottom: 16
            }}>
              {post.content}
            </p>

            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 16,
              borderTop: "1px solid #f3f4f6"
            }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>
                {post.photos}
              </span>
              <button style={{
                padding: "6px 16px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 13,
                color: "#374151"
              }}>
                詳細を見る →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: 32, 
        padding: 20, 
        background: "#f9fafb", 
        borderRadius: 8,
        textAlign: "center"
      }}>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          💡 今後の実装予定：記事の投稿・編集機能、写真のアップロード、コメント機能など
        </p>
      </div>
    </div>
  );
}
