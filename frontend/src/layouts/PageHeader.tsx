/**
 * PageHeader Component
 * 
 * 各ページのヘッダー部分を表示するコンポーネント
 * ページタイトル、説明文、アイコン、戻るボタンなどを
 * 統一されたスタイルで提供します。
 * 
 * @param title - ページタイトル（必須）
 * @param description - ページの説明文（オプション）
 * @param icon - ページアイコン（絵文字など）
 * @param onBack - 戻るボタンのイベントハンドラー
 * @param backLabel - 戻るボタンのテキスト（デフォルト: 「← ダッシュボードに戻る」）
 */
import React from "react";
import Typography from "../components/common/Typography";
import Button from "../components/common/Button";

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: string;
    onBack?: () => void;
    backLabel?: string;
}

export default function PageHeader({
    title,
    description,
    onBack,
    backLabel = "← ダッシュボードに戻る"
}: PageHeaderProps) {
    return (
        <div>
            {onBack && (
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBack}
                    style={{ marginBottom: 24 }}
                >
                    {backLabel}
                </Button>
            )}

            <Typography variant="h1" margin="small">
                {title}
            </Typography>

            {description && (
                <Typography variant="p" margin="lg" color="#6b7280">
                    {description}
                </Typography>
            )}
        </div>
    );
}