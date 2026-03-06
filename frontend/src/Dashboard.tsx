import React from "react";
import Container from "./layouts/Container";
import { Typography } from "./components";

export default function Dashboard() {
  return (
    <>
      <Typography variant="h1">ダッシュボード</Typography>
      <Typography variant="body" style={{ marginTop: "var(--spacing-md)", color: "var(--color-text-sub)" }}>
        こちらのページは各メンバーによって実装される予定です。
      </Typography>
    </>
  );
}
