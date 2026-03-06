/**
 * Card Component
 * 
 * コンテンツをカード形式で表示するコンテナコンポーネント
 * 統一された背景、角丸、シャドウを提供し、
 * ダッシュボードやページレイアウトの基本要素として使用されます。
 * 
 * @param children - カード内に表示するコンテンツ
 * @param padding - カード内の余白（デフォルト: 32px）
 * @param style - 追加のスタイル（オプション）
 */
import React from "react";

interface CardProps {
    children: React.ReactNode;
    padding?: number;
    className?: string;
    style?: React.CSSProperties;
}

export default function Card({
    children,
    padding = 32,
    className = "",
    style = {}
}: CardProps) {
    return (
        <div
            className={className}
            style={{
                background: "white",
                padding,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                ...style
            }}
        >
            {children}
        </div>
    );
}