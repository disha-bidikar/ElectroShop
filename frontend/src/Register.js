import { useState } from "react";

function Register({ goToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

    const handleRegister = async () => {
  try {
    const res = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const text = await res.text(); // 👈 DEBUG

    if (!res.ok) {
      console.log(text);
      throw new Error(text);
    }

    alert("Registered successfully ✅");
    goToLogin();

  } catch (err) {
    console.error(err);
    alert("Registration failed ❌");
  }
};

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="logo">🛒 ElectroShop</h1>
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to start shopping</p>

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

        <button className="login-btn" onClick={handleRegister}>
          Register
        </button>

        <p style={{ marginTop: "15px", fontSize: "13px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#ff3c00", cursor: "pointer", fontWeight: "bold" }}
            onClick={goToLogin}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;