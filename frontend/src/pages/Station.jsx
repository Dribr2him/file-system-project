import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "../styles/styles";

const API = "https://file-system-project-production.up.railway.app";

function Station() {
    const { name } = useParams();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios
            .get(`${API}/files/${name}`)
            .then((res) => setFiles(res.data))
            .catch(() => alert("Error loading files ❌"));
    }, [name]);

    return (
        <div style={styles.content}>
            <h1>{name} Station</h1>

            {files.length === 0 && <p>مفيش ملفات لسه</p>}

            {files.map((f) => (
                <div key={f._id} style={styles.cardBox}>
                    <h3>{f.title}</h3>

                    {f.type === "link" ? (
                        <iframe
                            width="300"
                            height="200"
                            src={f.url.replace("watch?v=", "embed/")}
                            title="video"
                        />
                    ) : (
                        <a href={f.url} target="_blank" rel="noreferrer">
                            Open File
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Station;