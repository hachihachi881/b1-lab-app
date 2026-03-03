import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { EventList, Event } from "./components/events";
import { Card, Typography, Spacing } from "./components/common";

interface EventsProps {
  onBackToDashboard: () => void;
}

export default function Events({ onBackToDashboard }: EventsProps) {
  // 仮のイベントデータ
  const events: Event[] = [
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

  return (
    <Container maxWidth={1400}>
      <PageHeader
        title="イベント"
        description="研究室の各種イベント情報"
        icon="🎉"
        onBack={onBackToDashboard}
      />

      <EventList events={events} />

      <Spacing size="xl" direction="top">
        <Card
          style={{
            background: "#f9fafb",
            textAlign: "center"
          }}
          padding={20}
        >
          <Typography variant="caption" color="#6b7280" style={{ display: "block" }}>
            💡 今後の実装予定：イベントの追加・編集・削除機能、参加者管理など
          </Typography>
        </Card>
      </Spacing>
    </Container>
  );
}
