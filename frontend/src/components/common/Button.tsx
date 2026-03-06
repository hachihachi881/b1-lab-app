/**
 * Button Component
 * 
 * 統一されたデザインシステムに基づくボタンコンポーネント
 * 様々なバリエーション（primary, secondary, outline, ghost, danger）と
 * サイズ（sm, md, lg）をサポートし、BEMクラス名でスタイリングされます。
 * 
 * @param variant - ボタンのスタイル（primary, secondary, outline, ghost, danger）
 * @param size - ボタンのサイズ（sm, md, lg）
 * @param onClick - クリック時のイベントハンドラー
 * @param disabled - 無効状態の制御
 */
import React, { forwardRef } from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
    style?: React.CSSProperties;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    className = "",
    style = {}
}, ref) => {

    const baseClass = "button";
    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;
    const disabledClass = disabled ? "button--disabled" : "";
    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

    return (
        <button
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            style={style}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;