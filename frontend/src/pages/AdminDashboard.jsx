import { useState } from "react";
import axios from "axios";

const API = "https://file-system-project-production.up.railway.app";

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [station, setStation] = useState("math");
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("اختار ملف ❌");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("station", station);

    try {
      setLoading(true);

      await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      alert("تم الرفع ✅");
      setFile(null);
      setTitle("");

    } catch (err) {
      console.log(err);
      alert("فشل الرفع ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload File 🚀</h1>

        <label style={styles.label}>Choose File</label>
        <input
          type="file"
          style={styles.input}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <input
          placeholder="Enter Title..."
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          style={styles.input}
          value={station}
          onChange={(e) => setStation(e.target.value)}
        >
          <option value="math">Math</option>
          <option value="chemistry">Chemistry</option>
          <option value="physics">Physics</option>
        </select>

        <button
          style={{
            ...styles.button,
            background: loading ? "#555" : "linear-gradient(45deg,#4facfe,#00f2fe)"
          }}
          onClick={upload}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    fontFamily: "sans-serif",
  },

  card: {
    background: "#111",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    boxShadow: "0 0 30px rgba(0,0,0,0.6)",
    animation: "fadeIn 0.6s ease-in-out",
  },

  title: {
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center",
  },

  label: {
    color: "#aaa",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#222",
    color: "#fff",
    transition: "0.3s",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};