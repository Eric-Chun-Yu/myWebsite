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
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #d8b4fe, #a5f3fc, #fcd34d)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          padding: "40px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.25)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          textAlign: "center",
          transition: "transform 0.3s ease",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: 25,
            color: "#1e3a8a",
            letterSpacing: 1,
          }}
        >
          👋 Welcome to <span style={{ color: "#9333ea" }}>Your Portal</span>
        </h1>

        {user ? (
          <>
            <div style={{ position: "relative", marginBottom: 30 }}>
              <div
                style={{
                  width: 130,
                  height: 130,
                  margin: "0 auto",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                  padding: 5,
                  boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)",
                }}
              >
                <img
                  src={
                    avatarUrl
                      ? `${avatarUrl}?v=${new Date().getTime()}`
                      : "/default-avatar.png"
                  }
                  alt="頭貼"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "rotate(2deg) scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "rotate(0deg) scale(1)")
                  }
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 15,
                  fontSize: "1.2rem",
                  color: "#111827",
                  fontWeight: "600",
                  backgroundColor: "#fcd34d",
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                ✉️ {user.email}
              </div>
            </div>

            <UpdateAvatar />
          </>
        ) : (
          <p
            style={{
              color: "#1e293b",
              backgroundColor: "#fef3c7",
              padding: "20px",
              borderRadius: 12,
              fontSize: "1.1rem",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
            }}
          >
            🚧 您尚未登入或註冊，請前往登入以查看個人資訊並開啟留言板功能 📝
          </p>
        )}
      </div>
    </div>
  );
}
