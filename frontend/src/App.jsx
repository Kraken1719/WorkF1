import { useState } from "react";
import { api } from "./api.js";
import AuthForm from "./AuthForm.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  const handleLogin = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", name);
    setToken(newToken);
    setUsername(name);
  };

  const handleLogout = async () => {
    try {
      await api.logout(token);
    } finally {
      localStorage.clear();
      setToken(null);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>WorkFlowHub</h1>
        {token && (
          <div>
            <span>Hi, {username}</span>
            <button onClick={handleLogout}>Log out</button>
          </div>
        )}
      </header>
      {token ? <p>You are logged in.</p> : <AuthForm onLogin={handleLogin} />}
    </div>
  );
}
