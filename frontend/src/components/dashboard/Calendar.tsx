import React, { useState } from "react";
import Card from "../common/Card";
import Typography from "../common/Typography";
import Button from "../common/Button";

interface CalendarProps {
    posts: any[];
    onEventClick: (post: any) => void;
}

export default function Calendar({ posts, onEventClick }: CalendarProps) {
    const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // 前月の日付
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({
            date: daysInPrevMonth - i,
            isCurrentMonth: false,
            year: month === 0 ? year - 1 : year,
            month: month === 0 ? 12 : month
        });
    }

    // 現在月の日付
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            date: i,
            isCurrentMonth: true,
            year: year,
            month: month + 1
        });
    }

    // 次月の日付
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
        days.push({
            date: i,
            isCurrentMonth: false,
            year: month === 11 ? year + 1 : year,
            month: month === 11 ? 1 : month + 2
        });
    }

    const today = new Date();
    const isToday = (dYear: number, dMonth: number, dDate: number) => {
        return today.getFullYear() === dYear &&
            today.getMonth() + 1 === dMonth &&
            today.getDate() === dDate;
    };

    const hasEvent = (dYear: number, dMonth: number, dDate: number) => {
        return posts.some(post => {
            if (!post.date) return false;
            const postDate = new Date(post.date);
            return postDate.getFullYear() === dYear &&
                postDate.getMonth() + 1 === dMonth &&
                postDate.getDate() === dDate;
        });
    };

    const getEventForDay = (dYear: number, dMonth: number, dDate: number) => {
        return posts.find(post => {
            if (!post.date) return false;
            const postDate = new Date(post.date);
            return postDate.getFullYear() === dYear &&
                postDate.getMonth() + 1 === dMonth &&
                postDate.getDate() === dDate;
        });
    };

    return (
        <Card style={{ height: "fit-content" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <button onClick={handlePrevMonth} style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    color: "#6b7280"
                }}>
                    ←
                </button>
                <Typography variant="h2" margin="none">
                    {year}年 {month + 1}月
                </Typography>
                <button onClick={handleNextMonth} style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    color: "#6b7280"
                }}>
                    →
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 8 }}>
                {daysOfWeek.map(day => (
                    <div key={day} style={{
                        textAlign: "center",
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#6b7280",
                        padding: "8px 4px"
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                {days.map((day, index) => {
                    const event = getEventForDay(day.year, day.month, day.date);
                    return (
                        <div
                            key={index}
                            onClick={() => event && onEventClick(event)}
                            style={{
                                minHeight: 40,
                                padding: "4px",
                                textAlign: "center",
                                cursor: event ? "pointer" : "default",
                                position: "relative",
                                backgroundColor: isToday(day.year, day.month, day.date)
                                    ? "#dbeafe"
                                    : day.isCurrentMonth
                                        ? "white"
                                        : "#f9fafb"
                            }}
                        >
                            <span style={{
                                fontSize: 13,
                                color: day.isCurrentMonth ? "#111827" : "#9ca3af"
                            }}>
                                {day.date}
                            </span>
                            {hasEvent(day.year, day.month, day.date) && (
                                <div style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    backgroundColor: "#3b82f6",
                                    position: "absolute",
                                    bottom: 4,
                                    left: "50%",
                                    transform: "translateX(-50%)"
                                }}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}