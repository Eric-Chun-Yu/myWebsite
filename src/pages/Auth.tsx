import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("登入失敗：" + error.message);
    } else {
      navigate("/"); // 登入後導回首頁
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>登入 / 註冊</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
      <input placeholder="密碼" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>登入</button>
      <p>{message}</p>
    </div>
  );
}
