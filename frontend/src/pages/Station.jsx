import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://file-system-project-production.up.railway.app";

function Station() {
  const [files, setFiles] = useState([]);
  const [role, setRole] = useState("user");

  const station = window.location.pathname.split("/")[2];

  // 🔥 decode token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setRole(decoded.role);
    }
  }, []);

  // 🔥 fetch files
  useEffect(() => {
    axios.get(`${API}/files/${station}`)
      .then(res => setFiles(res.data))
      .catch(err => console.log(err));
  }, [station]);

  // 🔥 delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/file/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setFiles(files.filter(f => f._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="page">
      <header className="header">
        📚 {station} Files
      </header>

      <div className="filesGrid">
        {files.map((file) => (
          <div className="fileCard" key={file._id}>
            <h3>{file.title}</h3>

            <a
              href={`${API}/uploads/${file.filename}`}
              target="_blank"
              rel="noreferrer"
              className="downloadBtn"
            >
              Download
            </a>

            {(role === "admin" || role === "owner") && (
              <button
                className="deleteBtn"
                onClick={() => handleDelete(file._id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Station;