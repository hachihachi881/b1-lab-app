import React from "react";

interface StatusBadgeProps {
    status: string;
    variant?: "event" | "schedule" | "custom";
    customColors?: { bg: string; color: string };
    className?: string;
}

export default function StatusBadge({
    status,
    variant = "custom",
    customColors,
    className = ""
}: StatusBadgeProps) {
    const getColors = () => {
        if (customColors) {
            return customColors;
        }

        if (variant === "event") {
            switch (status) {
                case "交流": return { bg: "#dbeafe", color: "#1e40af" };
                case "講演": return { bg: "#fce7f3", color: "#9f1239" };
                default: return { bg: "#f3f4f6", color: "#374151" };
            }
        }

        if (variant === "schedule") {
            switch (status) {
                case "予定": return { bg: "#f0f9ff", color: "#0369a1" };
                case "完了": return { bg: "#f0fdf4", color: "#166534" };
                case "進行中": return { bg: "#fef3c7", color: "#92400e" };
                default: return { bg: "#f3f4f6", color: "#374151" };
            }
        }

        // default variant or unknown status
        return { bg: "#f3f4f6", color: "#374151" };
    };

    const { bg, color } = getColors();

    return (
        <span
            className={className}
            style={{
                background: bg,
                color: color,
                padding: "4px 12px",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 500,
                display: "inline-block"
            }}
        >
            {status}
        </span>
    );
}