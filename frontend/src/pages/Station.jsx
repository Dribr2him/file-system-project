import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://file-system-project-production.up.railway.app";

function Station({ station }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios.get(`${API}/files/${station}`)
      .then(res => setFiles(res.data))
      .catch(err => console.log(err));
  }, [station]);

  return (
    <div>
      <h2>{station} Files</h2>

      {files.map((file) => (
        <div key={file._id}>
          <p>{file.title}</p>
          <a href={`${API}/uploads/${file.filename}`} target="_blank">
            Download
          </a>
        </div>
      ))}
    </div>
  );
}

export default Station;