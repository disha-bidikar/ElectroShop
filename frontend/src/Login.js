import { useState } from "react";

function Login({ setUser, goToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setUser(data);

    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="logo">🛒 ElectroShop</h1>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue shopping</p>

        <input
          className="login-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#ff3c00", cursor: "pointer", fontWeight: "bold" }}
            onClick={goToRegister}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;