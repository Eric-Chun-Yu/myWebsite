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
    const fetchAvatar = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profile")
          .select("avatar_url")
          .eq("id", user.id)
          .single();

        if (!error && data?.avatar_url) {
          console.log("✅ Navbar 載入頭貼：", data.avatar_url);
          setAvatarUrl(data.avatar_url);
        } else {
          console.warn("⚠️ 無法載入 avatar_url，使用預設圖");
          setAvatarUrl(null);
        }
      }
    };

    fetchAvatar();
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
              src={avatarUrl || "/default-avatar.png"}
              alt="頭貼"
              onError={(e) =>
                (e.currentTarget.src = "/default-avatar.png")
              }
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
