import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("註冊中...");
    console.log("👉 開始註冊");

    // 註冊帳號
    const { error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      console.error("❌ 註冊錯誤：", signUpError.message);
      setMessage("❌ 註冊失敗：" + signUpError.message);
      return;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setMessage("❌ 無法取得登入 session，請確認是否關閉 Email 驗證");
      return;
    }

    const user = sessionData.session.user;
    console.log("✅ 使用者 UID：", user.id);

    // 上傳頭貼
    let avatarUrl = "";
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()?.toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(ext || "")) {
        setMessage("❌ 僅支援 jpg / png");
        return;
      }

      const filePath = `${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("headphoto")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        console.error("❌ 上傳頭貼失敗：", uploadError.message);
        setMessage("❌ 頭貼上傳失敗：" + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("headphoto").getPublicUrl(filePath);
      avatarUrl = data.publicUrl;
      console.log("✅ 頭貼網址：", avatarUrl);
    }

    // 寫入 profile
    const { error: profileError } = await supabase.from("profile").insert({
      id: user.id,
      username,
      avatar_url: avatarUrl,
    });

    if (profileError) {
      console.error("❌ profile 寫入錯誤：", profileError.message);
      setMessage("❌ 儲存使用者資料失敗：" + profileError.message);
      return;
    }

    setMessage("✅ 註冊成功！");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h1>🧪 測試：這是新版 Register.tsx</h1>
      <h2 style={{ textAlign: "center" }}>註冊帳號</h2>
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Email：
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label>
          密碼：
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>

        <label>
          使用者名稱（將顯示在留言板）：
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

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
                reader.onloadend = () => {
                  setPreviewUrl(reader.result as string);
                };
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

        <button type="submit" style={{ padding: "10px 20px", fontWeight: "bold" }}>
          註冊
        </button>
      </form>

      <p style={{ marginTop: 10, color: "#d00", textAlign: "center" }}>{message}</p>
    </div>
  );
}
