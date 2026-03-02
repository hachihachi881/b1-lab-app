import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { createPost, getPosts, updatePost, deletePost } from "./services/postService";
import { getTeaPartyInfo, saveTeaPartyInfo } from "./services/teaPartyService";
import { signOut } from "firebase/auth";
import { auth } from "./lib/firebase";
import LoginForm from "./utils/LoginForm";
import "../index.css";

// await signOut(auth);

// --- ナビゲーション ---
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <h2 style={{ color: "#3b82f6", marginRight: 24 }}>🧪 B1LabApp</h2>
        <a href="#" className="nav-item active">ダッシュボード</a>
        <a href="#" className="nav-item">発表スケジューラー</a>
        <a href="#" className="nav-item">お茶会ブログ</a>
        <a href="#" className="nav-item">設定</a>
      </div>
      <div className="nav-links">
        <div className="weather-widget">
          <span>☁️ 13℃ 徳島</span>
          <span style={{ marginLeft: 12, borderLeft: "1px solid #ccc", paddingLeft: 12 }}>2月28日(土) 14:09</span>
        </div>
      </div>
    </nav>
  );
}

// --- カレンダー ---
function Calendar({ posts, onEventClick }: { posts: any[], onEventClick: (post: any) => void }) {
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
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ date: daysInPrevMonth - i, isCurrentMonth: false, year: month === 0 ? year - 1 : year, month: month === 0 ? 12 : month });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: i, isCurrentMonth: true, year: year, month: month + 1 });
  }
  
  const totalCells = days.length <= 35 ? 35 : 42;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, isCurrentMonth: false, year: month === 11 ? year + 1 : year, month: month === 11 ? 1 : month + 2 });
  }

  const today = new Date();
  const isToday = (dYear: number, dMonth: number, dDate: number) => {
    return today.getFullYear() === dYear && (today.getMonth() + 1) === dMonth && today.getDate() === dDate;
  };

  return (
    <div className="card" style={{ padding: 0 }}>
      <div className="calendar-header" style={{ padding: "24px 24px 0" }}>
        <h2 style={{ fontSize: "20px" }}>{year}年{month + 1}月</h2>
        <div>
          <button onClick={handlePrevMonth} style={{ background: "white", color: "#333", border: "1px solid #ddd", marginRight: 8, padding: "4px 12px" }}>&lt;</button>
          <button onClick={handleNextMonth} style={{ background: "white", color: "#333", border: "1px solid #ddd", padding: "4px 12px" }}>&gt;</button>
        </div>
      </div>
      
      <div style={{ padding: 24 }}>
        <div className="calendar-grid">
          {daysOfWeek.map(day => (
            <div key={day} className="calendar-cell header">{day}</div>
          ))}
          
          {days.map((day, idx) => {
            const dateString = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
            const dayPosts = posts.filter(p => p.date === dateString);
            const currentIsToday = isToday(day.year, day.month, day.date);

            return (
              <div key={idx} className={`calendar-cell ${!day.isCurrentMonth ? 'other-month' : ''}`}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: currentIsToday ? "#3b82f6" : "transparent",
                  color: currentIsToday ? "white" : "inherit",
                  fontWeight: currentIsToday ? "bold" : "normal"
                }}>
                  {day.date}
                </div>
                
                {dayPosts.map(post => {
                  const colorClass = post.title.includes('お茶会') ? 'event-blue' : 'event-green';
                  return (
                    <div 
                      key={post.id} 
                      className={`event-label ${colorClass}`} 
                      style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                      onClick={() => onEventClick(post)}
                    >
                      {post.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- サイドバー ---
function Sidebar({ nextTeaParty, onEditTeaParty }: any) {
  return (
    <div className="sidebar">
      <div className="card card-blue" style={{ position: "relative" }}>
        <button 
          onClick={onEditTeaParty}
          style={{ position: "absolute", top: 16, right: 16, background: "rgba(255, 255, 255, 0.2)", padding: "4px 10px", fontSize: 12, borderRadius: 20 }}
        >
          ✏️ 編集
        </button>

        <p style={{ fontSize: 14, marginBottom: 8 }}>🔔 次のお茶会</p>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>{nextTeaParty.title}</h2>
        <p style={{ fontSize: 13, opacity: 0.9 }}>{nextTeaParty.datetime} | {nextTeaParty.location}</p>
        <p style={{ fontSize: 13, marginTop: 16, fontWeight: "bold" }}>担当グループ: {nextTeaParty.group}</p>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, borderBottom: "1px solid #eee", paddingBottom: 12, marginBottom: 12 }}>👥 グループ構成</h3>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f97316" }}></span>
              グループA
            </span>
            <span style={{ fontSize: 12, background: "#f3f4f6", padding: "2px 8px", borderRadius: 12 }}>10名</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- メイン ---
function App() {
  const { user, loading } = useAuth();
  const [allPosts, setAllPosts] = useState<any[]>([]);

  // 初期値（Firebaseからデータが取れるまでの仮表示）
  const [nextTeaParty, setNextTeaParty] = useState({
    title: "読込中...",
    datetime: "-",
    location: "-",
    group: "-"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isTeaPartyModalOpen, setIsTeaPartyModalOpen] = useState(false);
  const [tpTitle, setTpTitle] = useState("");
  const [tpDatetime, setTpDatetime] = useState("");
  const [tpLocation, setTpLocation] = useState("");
  const [tpGroup, setTpGroup] = useState("");
  const [isTpSubmitting, setIsTpSubmitting] = useState(false);

  // ▼ 初回レンダリング時に予定とお茶会データをFirebaseから取得
  useEffect(() => {
    if (!user) return;

    getPosts().then(setAllPosts);

    getTeaPartyInfo().then(data => {
      if (data) {
        setNextTeaParty(data);
      } else {
        setNextTeaParty({
          title: "第18回 お茶会",
          datetime: "2026年2月27日 (金) 15:00〜",
          location: "4F 輪講室",
          group: "グループB (カフェモカ)"
        });
      }
    });

  }, [user]);

  const handleOpenAdd = () => { setEditId(null); setTitle(""); setDate(""); setContent(""); setIsModalOpen(true); };
  const handleOpenEdit = (post: any) => { setEditId(post.id); setTitle(post.title); setDate(post.date || ""); setContent(post.content || ""); setIsModalOpen(true); };

  const handleSaveSchedule = async () => {
    if (!title || !date) return alert("タイトルと日付を入力してください");
    setIsSubmitting(true);
    if (editId) {
      await updatePost(editId, { title, content, date });
    } else {
      await createPost({ title, content, date, uid: user?.uid, authorName: user?.displayName ?? "unknown" });
    }
    setIsSubmitting(false); setIsModalOpen(false);
    getPosts().then(setAllPosts);
  };

  const handleDeleteSchedule = async () => {
    if (!editId) return;
    if (!window.confirm("この予定を削除してもよろしいですか？")) return;
    setIsSubmitting(true);
    await deletePost(editId);
    setIsSubmitting(false); setIsModalOpen(false);
    getPosts().then(setAllPosts);
  };

  const handleOpenTeaPartyEdit = () => {
    setTpTitle(nextTeaParty.title);
    setTpDatetime(nextTeaParty.datetime);
    setTpLocation(nextTeaParty.location);
    setTpGroup(nextTeaParty.group);
    setIsTeaPartyModalOpen(true);
  };

// ▼ お茶会データの保存処理（Firebaseに保存）
  const handleSaveTeaParty = async () => {
    setIsTpSubmitting(true);
    const newData = {
      title: tpTitle,
      datetime: tpDatetime,
      location: tpLocation,
      group: tpGroup
    };

    try {
      // Firebaseに保存
      await saveTeaPartyInfo(newData);

      // 画面のStateを更新
      setNextTeaParty(newData);
      setIsTeaPartyModalOpen(false);
    } catch (error) {
      console.error("お茶会データの保存エラー:", error);
      alert("保存に失敗しました。開発者ツールのConsoleを確認してください。");
    } finally {
      // 成功しても失敗しても「更新中...」を解除する
      setIsTpSubmitting(false);
    }
  };


  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <div className="header-actions">
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>ダッシュボード</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>研究室スケジュールの一元管理</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
          {user ? (
            <>
              <div style={{ display: "flex", alignItems: "center", marginRight: 16, fontSize: 14 }}>
                👤 {user.displayName}
              </div>

              <button onClick={handleOpenAdd}>
                ＋ 予定を追加
              </button>

              <button
                onClick={() => signOut(auth)}
                style={{ background: "#ef4444" }}
              >
                ログアウト
              </button>
            </>
          ) : (
            <LoginForm />
          )}
        </div>
        </div>

        <div className="content-grid">
          <div className="main-content">
            <Calendar posts={allPosts} onEventClick={handleOpenEdit} />
          </div>
          <Sidebar nextTeaParty={nextTeaParty} onEditTeaParty={handleOpenTeaPartyEdit} />
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: 16 }}>{editId ? "予定を編集" : "新しい予定を追加"}</h3>
            <label style={labelStyle}>タイトル</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
            <label style={labelStyle}>日付</label>
            <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} />
            <label style={labelStyle}>詳細 (任意)</label>
            <textarea style={{ ...inputStyle, height: 80 }} value={content} onChange={e => setContent(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <div>
                {editId && <button onClick={handleDeleteSchedule} disabled={isSubmitting} style={{ background: "#ef4444", color: "white" }}>削除</button>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "white", color: "#666", border: "1px solid #ccc" }}>キャンセル</button>
                <button onClick={handleSaveSchedule} disabled={isSubmitting}>{isSubmitting ? "保存中..." : "保存する"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTeaPartyModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: 16 }}>「次のお茶会」を編集</h3>
            <label style={labelStyle}>タイトル</label>
            <input style={inputStyle} value={tpTitle} onChange={e => setTpTitle(e.target.value)} />
            <label style={labelStyle}>日時</label>
            <input style={inputStyle} value={tpDatetime} onChange={e => setTpDatetime(e.target.value)} />
            <label style={labelStyle}>場所</label>
            <input style={inputStyle} value={tpLocation} onChange={e => setTpLocation(e.target.value)} />
            <label style={labelStyle}>担当グループ</label>
            <input style={inputStyle} value={tpGroup} onChange={e => setTpGroup(e.target.value)} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
              <button onClick={() => setIsTeaPartyModalOpen(false)} style={{ background: "white", color: "#666", border: "1px solid #ccc" }}>キャンセル</button>
              <button onClick={handleSaveTeaParty} disabled={isTpSubmitting}>
                {isTpSubmitting ? "更新中..." : "更新する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
const modalContentStyle: React.CSSProperties = { background: "white", padding: 24, borderRadius: 12, width: "100%", maxWidth: 400, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: "bold", color: "#4b5563", marginBottom: 4 };
const inputStyle: React.CSSProperties = { width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 16, boxSizing: "border-box" };

export default App;