import React from "react";

interface SpacingProps {
    children: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    direction?: "top" | "bottom" | "both";
    className?: string;
    style?: React.CSSProperties;
}

export default function Spacing({
    children,
    size = "md",
    direction = "bottom",
    className = "",
    style = {}
}: SpacingProps) {
    const getSpacingValue = () => {
        switch (size) {
            case "xs": return 4;
            case "sm": return 8;
            case "md": return 16;
            case "lg": return 24;
            case "xl": return 32;
            default: return 16;
        }
    };

    const getSpacingStyle = () => {
        const spacing = getSpacingValue();
        switch (direction) {
            case "top": return { marginTop: spacing };
            case "bottom": return { marginBottom: spacing };
            case "both": return { margin: `${spacing}px 0` };
            default: return { marginBottom: spacing };
        }
    };

    const spacingStyle = getSpacingStyle();

    return (
        <div
            className={className}
            style={{
                ...spacingStyle,
                ...style
            }}
        >
            {children}
        </div>
    );
}