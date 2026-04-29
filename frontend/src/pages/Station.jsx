import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "https://file-system-project-production.up.railway.app";

function Station() {
  const { name } = useParams(); // ✅ بدل الطريقة القديمة
  const [files, setFiles] = useState([]);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  // 🔐 decode token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setRole(decoded.role);
      } catch {
        setRole("user");
      }
    }
  }, []);

  // 📂 fetch files
  useEffect(() => {
    setLoading(true);

    axios.get(`${API}/files/${name}`)
      .then(res => setFiles(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));

  }, [name]);

  // 🗑 delete
  const handleDelete = async (id) => {
    if (!window.confirm("متأكد عايز تمسح الملف؟")) return;

    try {
      await axios.delete(`${API}/file/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setFiles(prev => prev.filter(f => f._id !== id));

    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="stationPage">

      {/* Header */}
      <div className="stationHeader">
        <h1>📚 {name.toUpperCase()} Files</h1>
        <p>Browse all available resources</p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (

        <div className="filesGrid">

          {files.length === 0 && (
            <p>مفيش ملفات لسه 😢</p>
          )}

          {files.map((file) => (
            <div className="fileCard" key={file._id}>

              <h3>{file.title}</h3>

              <div className="actions">

                <a
                  href={`${API}/uploads/${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="downloadBtn"
                >
                  ⬇ Download
                </a>

                {(role === "admin" || role === "owner") && (
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(file._id)}
                  >
                    🗑 Delete
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default Station;