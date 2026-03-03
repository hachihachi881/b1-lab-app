import React from "react";

interface TypographyProps {
    variant: "h1" | "h2" | "h3" | "p" | "caption";
    children: React.ReactNode;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
    margin?: "none" | "small" | "medium" | "large" | "lg";
}

export default function Typography({
    variant,
    children,
    color,
    className = "",
    style = {},
    margin = "medium"
}: TypographyProps) {
    const getMarginValue = (margin: string) => {
        switch (margin) {
            case "none": return 0;
            case "small": return 8;
            case "medium": return 16;
            case "large":
            case "lg": return 24;
            default: return 16;
        }
    };

    const getVariantStyles = () => {
        const marginBottom = getMarginValue(margin);

        switch (variant) {
            case "h1":
                return {
                    fontSize: 28,
                    marginBottom,
                    fontWeight: "bold",
                    color: color || "#111827"
                };
            case "h2":
                return {
                    fontSize: 20,
                    marginBottom,
                    fontWeight: "600",
                    color: color || "#111827"
                };
            case "h3":
                return {
                    fontSize: 18,
                    marginBottom,
                    fontWeight: "600",
                    color: color || "#111827"
                };
            case "p":
                return {
                    fontSize: 14,
                    marginBottom,
                    lineHeight: "1.5",
                    color: color || "#374151"
                };
            case "caption":
                return {
                    fontSize: 12,
                    marginBottom: margin === "none" ? 0 : marginBottom,
                    color: color || "#6b7280"
                };
            default:
                return {};
        }
    };

    const variantStyles = getVariantStyles();
    const Tag = variant === "caption" ? "span" : variant;

    return React.createElement(
        Tag,
        {
            className,
            style: {
                ...variantStyles,
                ...style
            }
        },
        children
    );
}