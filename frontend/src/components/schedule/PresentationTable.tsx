import React from "react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import Typography from "../common/Typography";
import Spacing from "../common/Spacing";

export interface Presentation {
    id: number;
    date: string;
    presenter: string;
    title: string;
    status: string;
}

interface PresentationTableProps {
    presentations: Presentation[];
}

export default function PresentationTable({ presentations }: PresentationTableProps) {
    return (
        <Card>
            <Typography variant="h2" margin="lg">
                発表予定一覧
            </Typography>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                        <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>日付</th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>発表者</th>
                        <th style={{ padding: "12px", textAlign: "left", color: "#6b7280", fontSize: 14 }}>タイトル</th>
                        <th style={{ padding: "12px", textAlign: "center", color: "#6b7280", fontSize: 14 }}>状態</th>
                    </tr>
                </thead>
                <tbody>
                    {presentations.map(p => (
                        <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "16px", fontSize: 14 }}>{p.date}</td>
                            <td style={{ padding: "16px", fontSize: 14, fontWeight: "500" }}>{p.presenter}</td>
                            <td style={{ padding: "16px", fontSize: 14 }}>{p.title}</td>
                            <td style={{ padding: "16px", textAlign: "center" }}>
                                <StatusBadge status={p.status} variant="schedule" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Spacing size="xl" direction="top">
                <Card
                    style={{
                        background: "#f9fafb"
                    }}
                    padding={20}
                >
                    <Typography variant="caption" color="#6b7280" style={{ display: "block" }}>
                        💡 今後の実装予定：発表の追加・編集・削除機能、通知機能など
                    </Typography>
                </Card>
            </Spacing>
        </Card>
    );
}