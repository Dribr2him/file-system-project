import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Station from "./pages/Station";

import Layout from "./components/Layout";

// 🔐 حماية عامة
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

// 👑 حماية الأدمن
function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));

    return (decoded.role === "admin" || decoded.role === "owner")
      ? children
      : <Navigate to="/" />;

  } catch (err) {
    return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Home */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* 🔐 Auth */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        {/* 👨‍🎓 Station */}
        <Route
          path="/station/:name"
          element={
            <Layout>
              <Station />
            </Layout>
          }
        />

        {/* 👑 Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;