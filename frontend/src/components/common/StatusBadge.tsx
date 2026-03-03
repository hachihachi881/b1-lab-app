import React from "react";

interface StatusBadgeProps {
    status: string;
    variant?: "event" | "schedule" | "custom" | "default";
    customColors?: { bg: string; color: string };
    className?: string;
}

export default function StatusBadge({
    status,
    variant = "custom",
    customColors,
    className = ""
}: StatusBadgeProps) {
    const getVariantClass = () => {
        if (variant === "event") {
            switch (status) {
                case "交流": return "status-badge status-badge--event-social";
                case "講演": return "status-badge status-badge--event-lecture";
                default: return "status-badge status-badge--default";
            }
        }

        if (variant === "schedule") {
            switch (status) {
                case "予定": return "status-badge status-badge--pending";
                case "完了": return "status-badge status-badge--done";
                case "進行中": return "status-badge status-badge--progress";
                default: return "status-badge status-badge--default";
            }
        }

        // default variant or unknown status
        return "status-badge status-badge--default";
    };

    if (customColors) {
        // Use custom colors via inline styles
        return (
            <span
                className={`status-badge ${className}`.trim()}
                style={{
                    backgroundColor: customColors.bg,
                    color: customColors.color
                }}
            >
                {status}
            </span>
        );
    }

    return (
        <span className={`${getVariantClass()} ${className}`.trim()}>
            {status}
        </span>
    );
}