import { useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
const URL = "https://chat-app-backend-0cyz.onrender.com"

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("chat-user")) || null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    console.log(data);
    if (data.error) {
      throw new Error(data.error);
    }

    localStorage.setItem("chat-user", JSON.stringify(data));
    setAuth(data)
  };

  return (
    <>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
      {!auth ? <h1>not auth</h1> : <Chat auth={auth}/>}
    </>
  );
}

export default App;
