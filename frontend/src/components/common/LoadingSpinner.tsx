/**
 * LoadingSpinner Component
 * 
 * ローディング状態を視覚的に表示するスピナーコンポーネント
 * API通信中、ページ初期ロード、フォーム送信時などに使用
 * オーバーレイ表示で画面全体をカバーすることも可能
 * 
 * @param size - スピナーのサイズ（sm: 16px, md: 24px, lg: 32px）
 * @param variant - スピナーの色（primary, secondary）
 * @param overlay - 画面全体をオーバーレイするか
 * @param text - ロード中に表示するテキスト
 */
import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "secondary";
    overlay?: boolean;
    text?: string;
}

export default function LoadingSpinner({
    size = "md",
    variant = "primary",
    overlay = false,
    text
}: LoadingSpinnerProps) {
    const sizeMap = {
        sm: "16px",
        md: "24px",
        lg: "32px"
    };

    const colorMap = {
        primary: "var(--color-primary)",
        secondary: "var(--color-text-sub)"
    };

    const spinnerStyle: React.CSSProperties = {
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid transparent`,
        borderTop: `3px solid ${colorMap[variant]}`,
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    };

    const containerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--spacing-md)",
        ...(overlay && {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
            justifyContent: "center"
        })
    };

    const textStyle: React.CSSProperties = {
        fontSize: "var(--font-size-sm)",
        color: "var(--color-text-sub)",
        margin: 0
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle} />
            {text && <p style={textStyle}>{text}</p>}

            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}