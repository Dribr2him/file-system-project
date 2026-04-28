import { useState } from "react";
import axios from "axios";
import styles from "../styles/styles";

const API = "https://file-system-project-production.up.railway.app";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign In</h2>

        <input placeholder="Username" style={styles.input} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" style={styles.input} onChange={(e) => setPassword(e.target.value)} />

        <button style={styles.button} onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Login;