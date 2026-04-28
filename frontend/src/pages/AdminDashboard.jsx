import { useState } from "react";
import axios from "axios";
import styles from "../styles/styles";

const API = "https://file-system-project-production.up.railway.app";

function AdminDashboard() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${API}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Uploaded ✅");
  };

  return (
    <div style={styles.dashboard}>
      <div style={styles.sidebar}>
        <h2>Admin</h2>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div style={styles.content}>
        <h1>Upload File</h1>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button style={styles.button} onClick={upload}>Upload</button>
      </div>
    </div>
  );
}

export default AdminDashboard;