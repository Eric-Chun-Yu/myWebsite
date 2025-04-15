import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("登入中...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("❌ 登入失敗：" + error.message);
      return;
    }
    setMessage("✅ 登入成功！");
    setTimeout(() => window.location.href = "/", 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("註冊中...");

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setMessage("❌ 註冊失敗：" + signUpError.message);
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setMessage("❌ 無法取得登入 session，請確認 Email 驗證是否關閉");
      return;
    }

    const user = sessionData.session.user;
    let avatarUrl = "";
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()?.toLowerCase();
      const filePath = `${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("headphoto")
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from("headphoto").getPublicUrl(filePath);
        avatarUrl = data.publicUrl;
      }
    }

    const { error: profileError } = await supabase.from("profile").insert({
      id: user.id,
      username,
      avatar_url: avatarUrl,
    });

    if (profileError) {
      setMessage("❌ 儲存使用者資料失敗：" + profileError.message);
      return;
    }

    setMessage("✅ 註冊成功！");
    setTimeout(() => window.location.href = "/", 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0f2fe, #fef9c3)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    }}>
      <div style={{
        width: "100%",
        maxWidth: 500,
        background: "white",
        padding: 40,
        borderRadius: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", color: "#1e3a8a", marginBottom: 20 }}>
          {isLogin ? "🔐 登入帳號" : "📝 註冊帳號"}
        </h2>

        <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            📧 Email：
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              style={inputStyle} />
          </label>

          <label>
            🔑 密碼：
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              style={inputStyle} />
          </label>

          {!isLogin && (
            <>
              <label>
                🙋 使用者名稱（留言板顯示）：
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                  style={inputStyle} />
              </label>

              <label>
                🖼️ 頭貼上傳（jpg/png）：
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setAvatarFile(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    } else {
                      setPreviewUrl(null);
                    }
                  }}
                  style={inputStyle}
                />
              </label>

              {previewUrl && (
                <div style={{ textAlign: "center" }}>
                  <p>頭貼預覽：</p>
                  <img
                    src={previewUrl}
                    alt="頭貼預覽"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                      margin: "10px auto",
                    }}
                  />
                </div>
              )}
            </>
          )}

          <button type="submit" style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "10px",
            borderRadius: 8,
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem"
          }}>
            {isLogin ? "登入" : "註冊"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, color: "#444" }}>{message}</p>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.95rem" }}>
          {isLogin ? "還沒有帳號？" : "已經有帳號？"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} style={{
            background: "none",
            border: "none",
            color: "#1d4ed8",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            {isLogin ? "點我註冊" : "前往登入"}
          </button>
        </p>
      </div>
    </div>
  );
}

// 🔧 可重用 input 欄位樣式
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 5,
};
