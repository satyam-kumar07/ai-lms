import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      console.log("LOGIN RESPONSE:", res.data); // 🔍 DEBUG

      const token = res.data.token;
      const userId =
        res.data.userId || res.data.user?._id || res.data.user?.id;

      if (!token || !userId) {
        alert("Login response missing data ❌");
        return;
      }

      // ✅ SAVE CORRECTLY
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      alert("Login successful 🚀");

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div style={{ width: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;