import { useState } from "react";
import axios from "axios";

const API = "https://file-system-project-production.up.railway.app";

function AdminDashboard() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [station, setStation] = useState("math");

  const upload = async () => {
    if (!file) return alert("اختار ملف ❌");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("station", station);

    try {
      await axios.post(`${API}/upload`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      alert("تم الرفع ✅");
    } catch (err) {
      console.log(err);
      alert("فشل الرفع ❌");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <select onChange={(e) => setStation(e.target.value)}>
        <option value="math">Math</option>
        <option value="chemistry">Chemistry</option>
        <option value="physics">Physics</option>
      </select>

      <button onClick={upload}>Upload</button>
    </div>
  );
}

export default AdminDashboard;