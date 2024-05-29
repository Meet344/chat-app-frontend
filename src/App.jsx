import { useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
// const URL = "https://chat-app-backend-0cyz.onrender.com"
const URL = "https://clone-satpavidhi.onrender.com"

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("")) || null)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${URL}/api/profile/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ username, password }),
      body: JSON.stringify({ contact_no: username, password }),
    });

    const data = await res.json();
    console.log(data);
    if (data.error) {
      throw new Error(data.error);
    }

    // localStorage.setItem("chat-user", JSON.stringify(data));
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', data.data.Fields._id)
    setAuth(data.data.Fields._id)
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
