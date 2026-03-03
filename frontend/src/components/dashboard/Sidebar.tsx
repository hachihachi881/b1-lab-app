import React from "react";
import Card from "../common/Card";
import Typography from "../common/Typography";
import Button from "../common/Button";

interface SidebarProps {
    nextTeaParty: {
        title: string;
        datetime: string;
        location: string;
        group: string;
    };
    onEditTeaParty: () => void;
    isAdmin: boolean;
}

export default function Sidebar({ nextTeaParty, onEditTeaParty, isAdmin }: SidebarProps) {
    return (
        <div className="sidebar">
            <Card style={{
                position: "relative",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white"
            }}>
                {isAdmin && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onEditTeaParty}
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            background: "rgba(255, 255, 255, 0.2)",
                            color: "white"
                        }}
                    >
                        ✏️ 編集
                    </Button>
                )}

                <Typography variant="caption" margin="small" style={{ display: "block" }}>
                    🔔 次のお茶会
                </Typography>
                <Typography variant="h2" margin="small">
                    {nextTeaParty.title}
                </Typography>
                <Typography variant="caption" margin="none" style={{ opacity: 0.9, display: "block" }}>
                    {nextTeaParty.datetime} | {nextTeaParty.location}
                </Typography>
                <Typography variant="caption" margin="none" style={{
                    fontWeight: "bold",
                    marginTop: 16,
                    display: "block"
                }}>
                    担当グループ: {nextTeaParty.group}
                </Typography>
            </Card>

            <Card>
                <Typography variant="h3" margin="medium" style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: 12
                }}>
                    👥 グループ構成
                </Typography>
                <div style={{ marginBottom: 16 }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#f97316"
                            }}></span>
                            グループA
                        </span>
                        <span style={{
                            fontSize: 12,
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: 12
                        }}>
                            10名
                        </span>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#22c55e"
                            }}></span>
                            グループB
                        </span>
                        <span style={{
                            fontSize: 12,
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: 12
                        }}>
                            8名
                        </span>
                    </div>
                </div>

                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <span style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                        }}>
                            <span style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#3b82f6"
                            }}></span>
                            グループC
                        </span>
                        <span style={{
                            fontSize: 12,
                            background: "#f3f4f6",
                            padding: "2px 8px",
                            borderRadius: 12
                        }}>
                            12名
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}