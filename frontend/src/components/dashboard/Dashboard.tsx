import React, { useState } from "react";
import Calendar from "./Calendar";
import Sidebar from "./Sidebar";
import Modal from "./Modal";

interface DashboardProps {
    posts: any[];
    nextTeaParty: any;
    user: any;
    isAdmin: boolean;
    onEventClick: (post: any) => void;
    onEditTeaParty: () => void;
}

export default function Dashboard({
    posts,
    nextTeaParty,
    user,
    isAdmin,
    onEventClick,
    onEditTeaParty
}: DashboardProps) {
    return (
        <div style={{ padding: "24px" }}>
            <div className="content-grid">
                <div className="main-content">
                    <Calendar posts={posts} onEventClick={onEventClick} />
                </div>
                <Sidebar
                    nextTeaParty={nextTeaParty}
                    onEditTeaParty={onEditTeaParty}
                    isAdmin={isAdmin}
                />
            </div>
        </div>
    );
}