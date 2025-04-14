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
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) {
      console.error("❌ 註冊錯誤：", signUpError.message);
      setMessage("❌ 註冊失敗：" + signUpError.message);
      return;
    }
  
    console.log("✅ 註冊成功，取得 session 中...");
  
    // 取得登入狀態
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      console.error("❌ Session 錯誤：", sessionError?.message);
      setMessage("❌ 無法取得登入 session，請確認是否已關閉 Email 驗證功能");
      return;
    }
  
    const user = sessionData.session.user;
    console.log("✅ 登入使用者 UID：", user.id);
  
    // 上傳頭貼（若有選）
    let avatarUrl = "";
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()?.toLowerCase();
      if (!['jpg', 'jpeg', 'png'].includes(ext || "")) {
        setMessage("❌ 僅支援 jpg / png 格式");
        return;
      }
  
      const filePath = `${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("headphoto")
        .upload(filePath, avatarFile, { upsert: true });
  
      if (uploadError) {
        console.error("❌ 頭貼上傳失敗：", uploadError.message);
        setMessage("❌ 頭貼上傳失敗：" + uploadError.message);
        return;
      }
  
      const { data: urlData } = supabase.storage.from("headphoto").getPublicUrl(filePath);
      avatarUrl = urlData.publicUrl;
    }
  
    // 寫入 profile 表
    const { error: profileError } = await supabase.from("profile").insert({
      id: user.id,
      username: username,
      avatar_url: avatarUrl,
    });
  
    if (profileError) {
      console.error("❌ profile 寫入錯誤：", profileError.message);
      setMessage("❌ 儲存使用者資料失敗：" + profileError.message);
      return;
    }
  
    setMessage("✅ 註冊成功！");
  };

  return (
    <div>
      <h2>註冊帳號</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email：</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>密碼：</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>使用者名稱：</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>頭貼上傳（jpg/png）：</label>
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
        </div>

        {previewUrl && (
          <div>
            <p>預覽：</p>
            <img
              src={previewUrl}
              alt="預覽頭貼"
              style={{ width: "120px", borderRadius: "50%", border: "1px solid #ccc" }}
            />
          </div>
        )}

        <button type="submit">註冊</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
