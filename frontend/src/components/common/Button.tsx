import React from "react";

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

export default function Button({
    children,
    onClick,
    variant = "primary",
    size = "md",
    disabled = false,
    type = "button",
    className = "",
    style = {}
}: ButtonProps) {

    const baseClass = "button";
    const variantClass = `button--${variant}`;
    const sizeClass = `button--${size}`;
    const disabledClass = disabled ? "button--disabled" : "";
    const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={combinedClassName}
            style={style}
        >
            {children}
        </button>
    );
}