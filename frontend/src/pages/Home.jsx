import { Link } from "react-router-dom";
import {
  headerStyle,
  navBtn,
  gridStyle,
  cardStyle,
  imgStyle,
  footerStyle
} from "../styles/styles";

function Home() {
  const stations = [
    { name: "math", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb" },
    { name: "physics", img: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa" },
    { name: "chemistry", img: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6" }
  ];

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", color: "#fff" }}>

      {/* Header */}
      <div style={headerStyle}>
        <h2>My Platform 🚀</h2>

        <div>
          <Link to="/login">
            <button style={navBtn}>Login</button>
          </Link>

          <Link to="/register">
            <button style={navBtn}>Sign Up</button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div style={gridStyle}>
        {stations.map((s) => (
          <Link key={s.name} to={`/station/${s.name}`} style={{ textDecoration: "none" }}>
            <div style={cardStyle}>
              <img src={s.img} alt="" style={imgStyle} />
              <h3 style={{ marginTop: 10, color: "#fff" }}>{s.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <p>© 2026 All Rights Reserved</p>
      </div>

    </div>
  );
}

export default Home;