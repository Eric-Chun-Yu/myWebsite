import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true = 登入, false = 註冊
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("請填入 Email 與密碼");
      return;
    }

    setMessage("處理中...");

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage("登入失敗：" + error.message);
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage("註冊失敗：" + error.message);
      } else {
        setMessage("註冊成功！請回首頁設定頭貼");
        setIsLogin(true); // 註冊完切回登入
      }
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>{isLogin ? "登入" : "註冊"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleSubmit}>{isLogin ? "登入" : "註冊"}</button>

      <p style={{ marginTop: 10 }}>
        {isLogin ? "沒有帳號？" : "已有帳號？"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "前往註冊" : "前往登入"}
        </button>
      </p>

      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}
