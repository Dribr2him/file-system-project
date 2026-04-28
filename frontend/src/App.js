import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [link, setLink] = useState("");

  // 🔐 login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // 📥 تحميل الملفات
  const fetchFiles = async () => {
    const res = await axios.get("http://localhost:5000/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();

    // تحميل التوكن لو موجود
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // 🔐 login
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        username,
        password
      });

      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);

      alert("تم تسجيل الدخول ✅");
    } catch (err) {
      alert("خطأ في تسجيل الدخول ❌");
    }
  };

  // 📤 رفع ملف (محمية)
  const uploadFile = async () => {
    if (!token) return alert("لازم تعمل login الأول 🔐");
    if (!file) return alert("اختار ملف الأول");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:5000/upload", formData, {
      headers: {
        Authorization: token
      }
    });

    fetchFiles();
  };

  // 🔗 إضافة لينك
  const addLink = async () => {
    if (!link) return alert("حط لينك");

    await axios.post("http://localhost:5000/add-link", {
      title: "Video",
      url: link
    });

    setLink("");
    fetchFiles();
  };
  // ===== Delete File =====
  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchFiles();
    } catch (err) {
      alert("حصل خطأ في الحذف ❌");
      console.log(err);
    }
  };
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      color: "white",
      padding: 20,
      fontFamily: "Arial"
    }}>
      <h1>My File System</h1>

      {/* 🔐 Login */}
      {!token && (
        <>
          <h2>Login</h2>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={login}
            style={{
              marginTop: 10,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "#f59e0b",
              color: "white",
              cursor: "pointer"
            }}
          >
            Login
          </button>
        </>
      )}

      {/* 📤 Upload */}
      <h2>Upload File</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={uploadFile}
        style={{
          marginTop: 10,
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#3b82f6",
          color: "white",
          cursor: "pointer"
        }}
      >
        Upload
      </button>

      {/* 🔗 Add Link */}
      <h2>Add Video Link</h2>
      <input
        type="text"
        value={link}
        placeholder="YouTube link"
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        onClick={addLink}
        style={{
          marginTop: 10,
          padding: "10px",
          borderRadius: "8px",
          border: "none",
          background: "#22c55e",
          color: "white",
          cursor: "pointer"
        }}
      >
        Add
      </button>


      {/* 📂 Files */}
      <h2>All Files</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "15px"
        }}
      >
        {files.map((f) => (
          <div
            key={f._id}
            style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "10px"
            }}
          >
            <p>{f.title}</p>

            {f.type === "link" ? (
              <iframe
                width="100%"
                height="150"
                src={f.url.replace("watch?v=", "embed/")}
                title="video"
                frameBorder="0"
                allowFullScreen
              />
            ) : (
              <>
                <a
                  href={`http://localhost:5000/${f.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📂 Open File
                </a>

                {f.type.startsWith("audio") && (
                  <audio controls style={{ width: "100%", marginTop: 10 }}>
                    <source src={`http://localhost:5000/${f.url}`} />
                  </audio>
                )}
              </>
            )}
            : (
            <a
              href={`http://localhost:5000/${f.url}`}
              target="_blank"
              rel="noreferrer"
            >
              📂 Open File
            </a>
            )

            <button
              onClick={() => deleteFile(f._id)}
              style={{
                marginTop: 10,
                padding: "8px",
                borderRadius: "6px",
                border: "none",
                background: "#ef4444",
                color: "white",
                cursor: "pointer"
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;