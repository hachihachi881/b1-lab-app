import React, { Component, ReactNode } from "react";

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: string;
}

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: string) => void;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // エラーが発生した時の状態を更新
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // エラーログの記録
        console.error("Error Boundary caught an error:", error);
        console.error("Error Info:", errorInfo);

        this.setState({
            errorInfo: errorInfo.componentStack,
        });

        // カスタムエラーハンドラーの実行
        if (this.props.onError) {
            this.props.onError(error, errorInfo.componentStack);
        }
    }

    private handleRetry = () => {
        this.setState({
            hasError: false,
            error: undefined,
            errorInfo: undefined,
        });
    };

    render() {
        if (this.state.hasError) {
            // カスタムフォールバックUIがある場合はそれを使用
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // デフォルトのエラーUI
            return (
                <div style={{
                    padding: 24,
                    textAlign: "center",
                    background: "#fff3cd",
                    border: "1px solid #ffeeba",
                    borderRadius: 8,
                    color: "#856404"
                }}>
                    <h2>予期しないエラーが発生しました</h2>
                    {import.meta.env.DEV && (
                        <details style={{ marginTop: 16, textAlign: "left" }}>
                            <summary>エラー詳細（開発モードのみ）</summary>
                            <pre style={{
                                background: "#f8f9fa",
                                padding: 12,
                                borderRadius: 4,
                                fontSize: "12px",
                                overflow: "auto",
                                marginTop: 8
                            }}>
                                {this.state.error?.stack}
                                {this.state.errorInfo && `\n\nComponent Stack:${this.state.errorInfo}`}
                            </pre>
                        </details>
                    )}
                    <button
                        onClick={this.handleRetry}
                        style={{
                            marginTop: 16,
                            padding: "8px 16px",
                            background: "#ffc107",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        再試行
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// HOC (Higher-Order Component) として使用できるラッパー
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <Component {...props} />
            </ErrorBoundary>
        );
    };
}

export default ErrorBoundary;