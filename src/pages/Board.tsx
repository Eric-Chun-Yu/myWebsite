// ✅ Board.tsx
// 功能：登入使用者可留言、刪除自己的留言、顯示使用者頭貼與名稱

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  id: number;
  user_id: string;
  context: string;
  created_at: string;
  profile: {
    username: string;
    avatar_url: string;
  };
}

export default function Board() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 讀取所有留言 + 關聯 profile 表
  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("message_profile")
      .select("id, user_id, context, created_at, profile:profile_id(username, avatar_url)")
      .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        const cleaned = data.map((item) => {
          const profile = item.profile as { username?: string; avatar_url?: string }; // ✅ 強型別轉換
      
          return {
            id: item.id,
            user_id: item.user_id,
            context: item.context,
            created_at: item.created_at,
            profile: {
              username: profile.username || "未知使用者",
              avatar_url: profile.avatar_url || "/default-avatar.png",
            },
          };
        });
      setMessages(cleaned);
    }
    setLoading(false);
  };

  // 發送新留言
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("message_profile").insert({
      user_id: user?.id,
      profile_id: user?.id, // 關聯用
      context: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      fetchMessages();
    }
  };

  // 刪除留言
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("message_profile").delete().eq("id", id);
    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>留言板</h2>

      {loading ? <p>載入中...</p> : null}

      {messages.map((msg) => (
        <div key={msg.id} style={{ borderBottom: "1px solid #ccc", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={msg.profile.avatar_url || "/default-avatar.png"}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
            <strong>{msg.profile.username}</strong>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>{new Date(msg.created_at).toLocaleString()}</span>
          </div>
          <p style={{ marginLeft: 50 }}>{msg.context}</p>
          {user?.id === msg.user_id && (
            <button onClick={() => handleDelete(msg.id)} style={{ marginLeft: 50, color: "red" }}>
              刪除留言
            </button>
          )}
        </div>
      ))}

      <hr />
      <div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={3}
          placeholder="輸入留言..."
          style={{ width: "100%" }}
        />
        <button onClick={handleSend} disabled={!user}>送出留言</button>
        {!user && <p style={{ color: "gray" }}>請先登入才能留言</p>}
      </div>
    </div>
  );
}
