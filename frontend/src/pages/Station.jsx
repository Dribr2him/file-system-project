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
  <header className="header">
    <h1>📚 {station} Files</h1>
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