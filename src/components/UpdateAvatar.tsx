import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function UpdateAvatar() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(ext || "")) {
      setMessage("❌ 僅支援 jpg / png");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    const filePath = `${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("headphoto")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage("❌ 上傳失敗：" + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("headphoto").getPublicUrl(filePath);
    const avatarUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from("profile")
      .update({ avatar_url: avatarUrl })
      .eq("user_id", user.id);

    if (updateError) {
      setMessage("❌ 更新資料庫失敗：" + updateError.message);
      return;
    }

    setMessage("✅ 頭貼上傳成功！");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div>
      <h3>上傳或更新頭貼</h3>
      <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
      {preview && (
        <div>
          <p>預覽：</p>
          <img src={preview} style={{ width: 120, borderRadius: "50%" }} />
        </div>
      )}
      <button onClick={handleUpload} disabled={!file}>上傳頭貼</button>
      <p>{message}</p>
    </div>
  );
}
