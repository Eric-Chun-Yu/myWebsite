import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  useEffect(() => {
    if (!user) return;

    const fetchAvatarFromBucket = async () => {
      // 嘗試依副檔名組成路徑
      const extensions = ["jpg", "jpeg", "png"];
      let foundUrl = null;

      for (const ext of extensions) {
        const path = `${user.id}.${ext}`;
        const { data } = supabase.storage
          .from("headphoto")
          .getPublicUrl(path);

        // 可以額外確認網址是否真的存在（此處假設網址一定有效）
        if (data?.publicUrl) {
          foundUrl = data.publicUrl;
          break;
        }
      }

      if (foundUrl) {
        console.log("✅ Navbar 從 headphoto bucket 載入頭貼：", foundUrl);
        setAvatarUrl(foundUrl);
      } else {
        console.warn("⚠️ 找不到頭貼圖片");
        setAvatarUrl(null);
      }
    };

    fetchAvatarFromBucket();
  }, [user]);

  return (
    <nav
      style={{
        display: "flex",
        gap: 20,
        alignItems: "center",
        padding: 10,
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">首頁</Link>
      <Link to="/about">關於</Link>
      <Link to="/board">留言板</Link>

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {user ? (
          <>
            <img
              src={
                avatarUrl
                  ? `${avatarUrl}?v=${new Date().getTime()}`
                  : "/default-avatar.png"
              }
              alt="頭貼"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/default-avatar.png";
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span>{user.email}</span>
            <button onClick={handleLogout}>登出</button>
          </>
        ) : (
          <Link to="/auth">登入 / 註冊</Link>
        )}
      </div>
    </nav>
  );
}
