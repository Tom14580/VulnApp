import { useState } from "react";
import "../styles/form.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
      alert("Registered successfully");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <div className="form-card">
      <h2>Register</h2>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;