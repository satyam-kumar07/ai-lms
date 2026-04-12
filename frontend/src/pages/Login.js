import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    navigate("/dashboard"); 
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;