import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import UpdateAvatar from "../components/UpdateAvatar";

export default function Home() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAvatarFromStorage = async () => {
      const extensions = ["jpg", "jpeg", "png"];
      let foundUrl = null;

      for (const ext of extensions) {
        const path = `${user.id}.${ext}`;
        const { data } = supabase.storage.from("headphoto").getPublicUrl(path);
        if (data?.publicUrl) {
          foundUrl = data.publicUrl;
          break;
        }
      }

      setAvatarUrl(foundUrl);
    };

    fetchAvatarFromStorage();
  }, [user]);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>歡迎來到首頁！</h2>

      {user ? (
        <div>
          <img
            src={
              avatarUrl
                ? `${avatarUrl}?v=${new Date().getTime()}`
                : "/default-avatar.png"
            }
            alt="頭貼"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
          <p>您好，{user.email}</p>
          <UpdateAvatar />
        </div>
      ) : (
        <p>請先登入以查看個人資訊</p>
      )}
    </div>
  );
}
