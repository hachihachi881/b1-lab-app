/**
 * Container Component
 * 
 * ページコンテンツをセンタリングし、最大幅を制限するコンテナコンポーネント
 * レスポンシブデザインをサポートし、統一されたページ余白と
 * コンテンツ幅を提供します。各ページのルート要素として使用します。
 * 
 * @param children - コンテナ内に表示するコンテンツ
 * @param maxWidth - コンテナの最大幅（デフォルト: 1200px）
 * @param className - 追加CSSクラス
 */
import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    maxWidth?: number;
    className?: string;
}

export default function Container({
    children,
    maxWidth = 1200,
    className = ""
}: ContainerProps) {
    return (
        <div
            className={className}
            style={{
                padding: "40px 80px",
                maxWidth,
                margin: "0 auto"
            }}
        >
            {children}
        </div>
    );
}