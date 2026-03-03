import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
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
    const getVariantStyles = () => {
        switch (variant) {
            case "primary":
                return {
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    ":hover": { background: "#2563eb" }
                };
            case "secondary":
                return {
                    background: "white",
                    color: "#374151",
                    border: "1px solid #ddd",
                    ":hover": { background: "#f9fafb" }
                };
            case "outline":
                return {
                    background: "transparent",
                    color: "#3b82f6",
                    border: "1px solid #3b82f6",
                    ":hover": { background: "#f0f9ff" }
                };
            case "ghost":
                return {
                    background: "transparent",
                    color: "#374151",
                    border: "none",
                    ":hover": { background: "#f9fafb" }
                };
            default:
                return {
                    background: "#3b82f6",
                    color: "white",
                    border: "none"
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return {
                    padding: "6px 12px",
                    fontSize: 12,
                    borderRadius: 4
                };
            case "md":
                return {
                    padding: "8px 16px",
                    fontSize: 14,
                    borderRadius: 6
                };
            case "lg":
                return {
                    padding: "12px 24px",
                    fontSize: 16,
                    borderRadius: 8
                };
            default:
                return {
                    padding: "8px 16px",
                    fontSize: 14,
                    borderRadius: 6
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={{
                ...variantStyles,
                ...sizeStyles,
                cursor: disabled ? "not-allowed" : "pointer",
                fontWeight: "bold",
                transition: "all 0.2s",
                opacity: disabled ? 0.6 : 1,
                ...style
            }}
        >
            {children}
        </button>
    );
}