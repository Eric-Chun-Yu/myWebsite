import { useAuth } from "../contexts/AuthContext";
import UpdateAvatar from "../components/UpdateAvatar";

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>歡迎來到首頁！</h2>

      {user ? (
        <div>
          <img
            src={
              user.user_metadata?.avatar_url || // 若你從登入 user 傳 avatar_url（非 profile）
              "/default-avatar.png" // 或你可以設定預設圖片
            }
            alt="頭貼"
            style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }}
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
