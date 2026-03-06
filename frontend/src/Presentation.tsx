import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Typography, Card } from "./components/common";

interface PresentationProps {
  onBackToDashboard: () => void;
}

export default function Presentation({ onBackToDashboard }: PresentationProps) {
  return (
    <Container>
      <PageHeader
        title="発表"
        description="研究室メンバーの発表予定を管理します"
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
