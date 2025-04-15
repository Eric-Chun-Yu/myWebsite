export default function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f2fe, #fef9c3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          width: "100%",
          backgroundColor: "#ffffffcc",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <img
          src="/myphoto.jpg"
          alt="我的照片"
          style={{
            width: 180,
            height: 180,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 30,
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        />

        <h1
          style={{
            fontSize: "1.8rem",
            color: "#1e3a8a",
            marginBottom: 20,
          }}
        >
          嗨，我是 <span style={{ fontWeight: "bold" }}>陳俊佑</span> 👨‍💻<br />
          電機所資安組碩一（學號 R13921A07）
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.9",
            color: "#374151",
            textAlign: "left",
          }}
        >
          🎯 我是陳俊佑，從小對樂高機器人充滿興趣，<strong>主動要求父母讓我假日前往竹北</strong>
          練習操縱機器人與程式設計。
          <br /><br />
          🧠 國高中時期經常待在資訊室，<strong>跟隨老師學習進階電腦語言與 Arduino</strong>，也因此激發了我對資訊領域的濃厚熱忱。
          <br /><br />
          👨‍🎓 我畢業於 <strong>國立陽明交通大學資訊工程學系</strong>，在學期間熱衷於硬體語言、人工智慧、自然語言處理以及光源追蹤等領域。
          <br /><br />
          💡 我喜歡探索技術，也樂於分享，歡迎與我交流！
        </p>
      </div>
    </div>
  );
}
