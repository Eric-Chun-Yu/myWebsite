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
    avatar_url?: string;
  };
  avatar_from_bucket: string; // ✅ 新增欄位，實際圖片 URL
}

export default function Board() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // 讀取所有留言 + 產生對應的 Storage 圖片網址
  const fetchMessages = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("message_profile")
      .select("id, user_id, context, created_at, profile:profile_id(username)")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      const cleaned = data.map((item) => {
        const profile = item.profile as { username?: string };
        const extensions = ["jpg", "jpeg", "png"];

        // 自動組合一個 storage 的網址（以 user_id 為檔名）
        let publicUrl = "";
        for (const ext of extensions) {
          const tryUrl = supabase.storage
            .from("headphoto")
            .getPublicUrl(`${item.user_id}.${ext}`).data.publicUrl;

          // 我們預設取第一個組合出來的格式（不確認是否真的存在）
          if (!publicUrl) publicUrl = tryUrl;
        }

        return {
          id: item.id,
          user_id: item.user_id,
          context: item.context,
          created_at: item.created_at,
          profile: {
            username: profile.username || "未知使用者",
          },
          avatar_from_bucket: publicUrl,
        };
      });

      setMessages(cleaned);
    }

    setLoading(false);
  };

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
              src={`${msg.avatar_from_bucket}?v=${new Date(msg.created_at).getTime()}`}
              alt="avatar"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                marginRight: 10,
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
            <strong>{msg.profile.username}</strong>
            <span style={{ marginLeft: "auto", fontSize: 12 }}>
              {new Date(msg.created_at).toLocaleString()}
            </span>
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
        <button onClick={handleSend} disabled={!user}>
          送出留言
        </button>
        {!user && <p style={{ color: "gray" }}>請先登入才能留言</p>}
      </div>
    </div>
  );
}
