import { useEffect, useState } from "react";
import io from "socket.io-client";

// const URL = "https://chat-app-backend-0cyz.onrender.com"
// const URL = "https://clone-satpavidhi.onrender.com";
const URL = "http://3.108.65.195:4000";

export default function Chat(props) {
  const { auth } = props;
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const getConversations = async () => {
      // const res = await fetch(`${URL}/api/users`,{
      const res = await fetch(`${URL}/api/profile/userlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "jwt": localStorage.getItem('chat-user'),
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
      setConversations(data.data);
    };

    getConversations();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      console.log("getMessage");
      const res = await fetch(
        `${URL}/api/message/messages/${selectedUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // "jwt": localStorage.getItem('chat-user'),
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.error) throw new Error(data.error);
      setMessages(data);
    };

    if (selectedUser?._id) getMessages();
  }, [selectedUser?._id, setMessages]);

  useEffect(() => {
    if (auth) {
      const socket = io(URL, {
        query: {
          // userId: auth._id,
          userId: auth,
        },
      });

      setSocket(socket);

      // // socket.on() is used to listen to the events. can be used both on client and server side
      // socket.on("getOnlineUsers", (users) => {
      //     setOnlineUsers(users);
      // });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [auth]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async () => {
    // const res = await fetch(`${URL}/api/messages/send/${selectedUser._id}`, {
    const res = await fetch(`${URL}/api/message/send/${selectedUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // jwt: localStorage.getItem("chat-user"),
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    setMessages([...messages, data]);
    setInput("");
  };
  return (
    <div>
      <h1>User</h1>
      <div className="side-panel">
        <h2>Users</h2>
        <ul>
          {conversations.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user)}>
              {user.user_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-box">
        {selectedUser ? (
          <>
            <h2>Chat with {selectedUser.fullName}</h2>
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className="message">
                  {msg.message}
                </div>
              ))}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </>
        ) : (
          <p>Select a user to chat with</p>
        )}
      </div>
    </div>
  );
}
