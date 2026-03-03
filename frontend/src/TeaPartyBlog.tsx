import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { BlogList, BlogPost } from "./components/blog";
import { Card, Typography, Spacing } from "./components/common";

interface TeaPartyBlogProps {
  onBackToDashboard: () => void;
}

export default function TeaPartyBlog({ onBackToDashboard }: TeaPartyBlogProps) {
  // 仮のお茶会記録データ
  const teaPartyPosts: BlogPost[] = [
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
    <Container>
      <PageHeader
        title="お茶会ブログ"
        description="研究室お茶会の記録と思い出"
        icon="☕"
        onBack={onBackToDashboard}
      />

      <BlogList posts={teaPartyPosts} />

      <Spacing size="xl" direction="top">
        <Card
          style={{
            background: "#f9fafb",
            textAlign: "center"
          }}
          padding={20}
        >
          <Typography variant="caption" color="#6b7280" style={{ display: "block" }}>
            💡 今後の実装予定：記事の投稿・編集機能、写真のアップロード、コメント機能など
          </Typography>
        </Card>
      </Spacing>
    </Container>
  );
}
