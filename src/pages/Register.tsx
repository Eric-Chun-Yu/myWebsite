import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [isLogin, setIsLogin] = useState(false); // 🔁 切換登入/註冊
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ✅ 登入功能
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("登入中...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("❌ 登入失敗：", error.message);
      setMessage("❌ 登入失敗：" + error.message);
      return;
    }

    setMessage("✅ 登入成功！");
    setTimeout(() => window.location.href = "/", 1000);
  };

  // ✅ 註冊功能
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
      setMessage("❌ 無法取得登入 session，請關閉 Email 驗證測試");
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
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 10 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        {isLogin ? "登入帳號" : "註冊帳號"}
      </h2>

      <form onSubmit={isLogin ? handleLogin : handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>Email：<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>密碼：<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>

        {!isLogin && (
          <>
            <label>使用者名稱（將顯示在留言板）：<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
            <label>
              頭貼上傳（jpg/png）：
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
              />
            </label>

            {previewUrl && (
              <div style={{ textAlign: "center" }}>
                <p>預覽：</p>
                <img src={previewUrl} alt="預覽頭貼" style={{ width: 120, borderRadius: "50%", border: "1px solid #ccc" }} />
              </div>
            )}
          </>
        )}

        <button type="submit" style={{ padding: "10px 20px", fontWeight: "bold" }}>
          {isLogin ? "登入" : "註冊"}
        </button>
      </form>

      <p style={{ marginTop: 10, color: "#444", textAlign: "center" }}>{message}</p>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        {isLogin ? "還沒有帳號？" : "已經有帳號？"}{" "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
          {isLogin ? "點我註冊" : "前往登入"}
        </button>
      </p>
    </div>
  );
}
