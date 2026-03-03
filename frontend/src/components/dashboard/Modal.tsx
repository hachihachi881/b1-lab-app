import React from "react";
import Button from "../common/Button";
import Typography from "../common/Typography";

// モーダルスタイル
const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
};

const modalContentStyle: React.CSSProperties = {
    background: "white",
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 4
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 8,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    marginBottom: 16,
    boxSizing: "border-box"
};

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onDelete?: () => void;
    title: string;
    setTitle: (title: string) => void;
    date: string;
    setDate: (date: string) => void;
    content: string;
    setContent: (content: string) => void;
    editId: string | null;
    isSubmitting: boolean;
}

export function ScheduleModal({
    isOpen,
    onClose,
    onSave,
    onDelete,
    title,
    setTitle,
    date,
    setDate,
    content,
    setContent,
    editId,
    isSubmitting
}: ScheduleModalProps) {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <Typography variant="h3" margin="medium">
                    {editId ? "予定を編集" : "新しい予定を追加"}
                </Typography>

                <label style={labelStyle}>タイトル</label>
                <input
                    style={inputStyle}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <label style={labelStyle}>日付</label>
                <input
                    type="date"
                    style={inputStyle}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />

                <label style={labelStyle}>詳細 (任意)</label>
                <textarea
                    style={{ ...inputStyle, height: 80 }}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <div>
                        {editId && onDelete && (
                            <Button
                                variant="primary"
                                onClick={onDelete}
                                disabled={isSubmitting}
                                style={{ background: "#ef4444" }}
                            >
                                削除
                            </Button>
                        )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={onClose}>
                            キャンセル
                        </Button>
                        <Button variant="primary" onClick={onSave} disabled={isSubmitting}>
                            {isSubmitting ? "保存中..." : "保存する"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface TeaPartyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    title: string;
    setTitle: (title: string) => void;
    datetime: string;
    setDatetime: (datetime: string) => void;
    location: string;
    setLocation: (location: string) => void;
    group: string;
    setGroup: (group: string) => void;
    isSubmitting: boolean;
}

export function TeaPartyModal({
    isOpen,
    onClose,
    onSave,
    title,
    setTitle,
    datetime,
    setDatetime,
    location,
    setLocation,
    group,
    setGroup,
    isSubmitting
}: TeaPartyModalProps) {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <Typography variant="h3" margin="medium">
                    「次のお茶会」を編集
                </Typography>

                <label style={labelStyle}>タイトル</label>
                <input
                    style={inputStyle}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />

                <label style={labelStyle}>日時</label>
                <input
                    style={inputStyle}
                    value={datetime}
                    onChange={e => setDatetime(e.target.value)}
                />

                <label style={labelStyle}>場所</label>
                <input
                    style={inputStyle}
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />

                <label style={labelStyle}>担当グループ</label>
                <input
                    style={inputStyle}
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                    <Button variant="secondary" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button variant="primary" onClick={onSave} disabled={isSubmitting}>
                        {isSubmitting ? "更新中..." : "更新する"}
                    </Button>
                </div>
            </div>
        </div>
    );
}