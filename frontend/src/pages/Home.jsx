import { useNavigate } from "react-router-dom";

function Home() {
  const nav = useNavigate();

  return (
    <div className="cardGrid">
      <div className="card" onClick={() => nav("/station/math")}>
        <h2>Math</h2>
      </div>

      <div className="card" onClick={() => nav("/station/physics")}>
        <h2>Physics</h2>
      </div>

      <div className="card" onClick={() => nav("/station/chemistry")}>
        <h2>Chemistry</h2>
      </div>
    </div>
  );
}

export default Home;