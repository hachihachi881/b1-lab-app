import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Typography, Card } from "./components";

interface SettingsProps {
  onBackToDashboard: () => void;
}

export default function Settings({ onBackToDashboard }: SettingsProps) {
  return (
    <Container>
      <PageHeader
        title="設定"
        description="アプリケーションの設定"
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
