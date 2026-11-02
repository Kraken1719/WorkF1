import { useState } from "react";
import { api } from "./api.js";

export default function AuthForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data =
        mode === "register"
          ? await api.register(form)
          : await api.login({ username: form.username, password: form.password });
      onLogin(data.token, form.username);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card auth">
      <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        {mode === "register" && (
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        )}
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === "login" ? "Log in" : "Register"}</button>
      </form>
      <button className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "No account? Register" : "Have an account? Log in"}
      </button>
    </div>
  );
}
