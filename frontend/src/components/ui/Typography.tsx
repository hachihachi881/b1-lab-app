/**
 * Typography Component
 * 
 * テキスト表示用の共通コンポーネント
 * 見出し（h1, h2, h3）、段落（p, body）、キャプション（caption）などの
 * 統一されたテキストスタイルを提供します。
 * 
 * @param variant - テキストの種類（h1, h2, h3, p, body, caption）
 * @param children - 表示するテキスト内容
 * @param color - テキストの色（オプション）
 * @param margin - マージンサイズ（none, small, medium, large）
 */
import React from "react";

interface TypographyProps {
    variant: "h1" | "h2" | "h3" | "p" | "body" | "caption";
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
            case "body":
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

    const getTag = (variant: string) => {
        switch (variant) {
            case "h1": return "h1";
            case "h2": return "h2";
            case "h3": return "h3";
            case "p":
            case "body": return "p";
            case "caption": return "span";
            default: return "p";
        }
    };

    const variantStyles = getVariantStyles();
    const Tag = getTag(variant);

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