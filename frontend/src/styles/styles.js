const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },

  card: {
    background: "#1e293b",
    padding: 30,
    borderRadius: 12,
    width: 300,
    textAlign: "center",
    color: "#fff"
  },

  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 8,
    border: "none"
  },

  button: {
    width: "100%",
    padding: 10,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  },

  dashboard: {
    display: "flex",
    height: "100vh"
  },

  sidebar: {
    width: 200,
    background: "#1e293b",
    color: "#fff",
    padding: 20
  },

  content: {
    flex: 1,
    padding: 20,
    background: "#0f172a",
    color: "#fff"
  },

  cardBox: {
    background: "#1e293b",
    padding: 20,
    borderRadius: 10,
    marginTop: 20
  }
};

export default styles;

// 🔥 Styles للـ Home
export const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 30px",
  background: "#1e293b"
};

export const navBtn = {
  marginLeft: 10,
  padding: "8px 15px",
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

export const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 20,
  padding: 30
};

export const cardStyle = {
  background: "#1e293b",
  padding: 15,
  borderRadius: 10,
  textAlign: "center"
};

export const imgStyle = {
  width: "100%",
  height: 150,
  objectFit: "cover",
  borderRadius: 8
};

export const footerStyle = {
  textAlign: "center",
  padding: 20,
  background: "#1e293b",
  marginTop: 20
};