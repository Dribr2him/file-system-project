import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "https://file-system-project-production.up.railway.app";

function Station() {
  const { name } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/files/${name}`)
      .then(res => setFiles(res.data))
      .catch(err => console.log(err));
  }, [name]);

  return (
    <div className="page">

      {/* 🔥 Header */}
      <header className="header">
        <h2>📚 File System</h2>
        <div className="nav">
          <a href="/">Home</a>
          <a href="/admin">Admin</a>
        </div>
      </header>

      {/* 🔥 Title */}
      <h1 className="title">{name} Files</h1>

      {/* 🔥 Files */}
      <div className="grid">
        {files.length === 0 ? (
          <p className="empty">No files yet 😢</p>
        ) : (
          files.map((file) => (
            <div className="card" key={file._id}>
              <h3>{file.title}</h3>

              <a
                href={`${API}/uploads/${file.filename}`}
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                Download
              </a>
            </div>
          ))
        )}
      </div>

      {/* 🔥 Footer */}
      <footer className="footer">
        <p>© 2026 File System | By Ibrahim 🚀</p>
      </footer>

    </div>
  );
}

export default Station;