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