import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Card, Typography } from "./components";

interface EventsProps {
  onBackToDashboard: () => void;
}

export default function Events({ onBackToDashboard }: EventsProps) {
  return (
    <Container>
      <PageHeader
        title="イベント"
        description="研究室の各種イベント情報"
        onBack={onBackToDashboard}
      />

      <Card>
        <Typography variant="h2">実装予定</Typography>
        <Typography variant="body" style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
          こちらのページは各メンバーによって実装される予定です。
        </Typography>
      </Card>
    </Container>
  );
}
