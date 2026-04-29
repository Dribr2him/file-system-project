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
    if (!title) return alert("اكتب عنوان للملف ❌");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("station", station);

    try {
      setLoading(true);

      const res = await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(res.data);
      alert("تم الرفع ✅");

      // 🔥 Reset
      setFile(null);
      setTitle("");
      setStation("math");

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("فشل الرفع ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload File</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <select
        value={station}
        onChange={(e) => setStation(e.target.value)}
      >
        <option value="math">Math</option>
        <option value="chemistry">Chemistry</option>
        <option value="physics">Physics</option>
      </select>

      <br /><br />

      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}

export default AdminDashboard;