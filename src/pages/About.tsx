export default function About() {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <img
          src="/myphoto.jpg"  // ✅ 路徑請看下方說明
          alt="我的照片"
          style={{ width: 200, borderRadius: "50%", marginBottom: 20 }}
        />
        <h1>大家好，我是電機所資安組碩一的陳俊佑 (學號：R13921A07)</h1>
      </div>
    );
  }