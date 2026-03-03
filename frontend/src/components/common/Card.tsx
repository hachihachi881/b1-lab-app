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