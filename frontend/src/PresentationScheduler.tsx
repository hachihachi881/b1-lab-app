import React from "react";
import Container from "./layouts/Container";
import PageHeader from "./layouts/PageHeader";
import { PresentationTable, Presentation } from "./components/schedule";

interface PresentationSchedulerProps {
  onBackToDashboard: () => void;
}

export default function PresentationScheduler({ onBackToDashboard }: PresentationSchedulerProps) {
  // 仮の発表データ
  const presentations: Presentation[] = [
    { id: 1, date: "2026年3月10日", presenter: "田中太郎", title: "機械学習による画像認識の研究", status: "予定" },
    { id: 2, date: "2026年3月17日", presenter: "佐藤花子", title: "量子コンピューティングの基礎", status: "予定" },
    { id: 3, date: "2026年3月24日", presenter: "鈴木一郎", title: "ブロックチェーン技術の応用", status: "予定" },
    { id: 4, date: "2026年2月24日", presenter: "山田次郎", title: "深層学習モデルの最適化", status: "完了" },
  ];

  return (
    <Container maxWidth={1400}>
      <PageHeader
        title="発表スケジューラー"
        description="研究室メンバーの発表予定を管理します"
        icon="📊"
        onBack={onBackToDashboard}
      />

      <PresentationTable presentations={presentations} />
    </Container>
  );
}
