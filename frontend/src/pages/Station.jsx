import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://file-system-project-production.up.railway.app";

function Station() {
  const [files, setFiles] = useState([]);
  const station = window.location.pathname.split("/")[2];

  useEffect(() => {
    axios.get(`${API}/files/${station}`)
      .then(res => setFiles(res.data))
      .catch(err => console.log(err));
  }, [station]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{station} Files</h2>

      {files.length === 0 && <p>مفيش ملفات لسه</p>}

      {files.map((file) => (
        <div key={file._id} style={{ marginBottom: 15 }}>
          <p>{file.title}</p>

          <a
            href={`${API}/uploads/${file.filename}`}
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}

export default Station;