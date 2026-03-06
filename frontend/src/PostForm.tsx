import React from "react";
import { Card, Typography } from "./components/common";

export default function PostForm() {
  return (
    <Card>
      <Typography variant="h2">投稿フォーム</Typography>
      <Typography variant="body" style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
        こちらのコンポーネントは各メンバーによって実装される予定です。
      </Typography>
    </Card>
  );
}
