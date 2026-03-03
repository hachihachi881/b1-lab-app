import React from "react";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import Typography from "../common/Typography";
import Spacing from "../common/Spacing";
import Button from "../common/Button";

export interface BlogPost {
    id: number;
    date: string;
    title: string;
    group: string;
    content: string;
    photos: string;
}

interface BlogListProps {
    posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
    return (
        <div style={{ display: "grid", gap: 24 }}>
            {posts.map(post => (
                <Card key={post.id}>
                    <Spacing size="md">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h2" margin="small">
                                {post.title}
                            </Typography>
                            <StatusBadge
                                status={post.group}
                                customColors={{ bg: "#fef3c7", color: "#92400e" }}
                            />
                        </div>
                        <Typography variant="caption" margin="none" style={{ display: "block" }}>
                            📅 {post.date}
                        </Typography>
                    </Spacing>

                    <Typography variant="p" margin="medium" style={{ fontSize: 15, lineHeight: 1.8 }}>
                        {post.content}
                    </Typography>

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 16,
                        borderTop: "1px solid #f3f4f6"
                    }}>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>
                            {post.photos}
                        </span>
                        <Button variant="ghost" size="sm">
                            詳細を見る →
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}