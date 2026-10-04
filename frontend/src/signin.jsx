import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();          // <-- top level, inside component

  const handleClick =  async  () => {
    // your logic...

    const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empid, password }),
        });

        const data = await res.json();
        
        navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      <input
        type="text"
        placeholder="Employee ID"
        value={empid}
        onChange={(e) => setEmpid(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

export default Signin;