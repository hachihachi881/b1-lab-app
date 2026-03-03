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
    icon,
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
                {icon && <span>{icon} </span>}
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