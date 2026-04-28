import { useState } from "react";
import axios from "axios";
import styles from "../styles/styles";

const API = "https://file-system-project-production.up.railway.app";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(""); // لو مش مستخدمه مش مشكلة
    const [password, setPassword] = useState("");

    const register = async () => {
        try {
            await axios.post(`${API}/register`, {
                username,
                password
            });

            alert("Account created ✅");

            window.location.href = "/login";
        } catch (err) {
            console.log(err);
            alert("Register failed ❌");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Create Account</h2>

                <input
                    placeholder="Username"
                    style={styles.input}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Email"
                    style={styles.input}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    style={styles.input}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* 🔥 هنا المهم */}
                <button style={styles.button} onClick={register}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Register;