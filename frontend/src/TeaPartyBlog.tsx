import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { Card, Typography } from "./components";

interface TeaPartyBlogProps {
  onBackToDashboard: () => void;
}

export default function TeaPartyBlog({ onBackToDashboard }: TeaPartyBlogProps) {
  return (
    <Container>
      <PageHeader
        title="お茶会ブログ"
        description="研究室お茶会の記録と思い出"
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
