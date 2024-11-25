import React, { useState } from "react";

const Chat = ({ messages, sendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage(""); // Limpiar input
  };

  return (
    <div style={styles.chatContainer}>
      <textarea
        readOnly
        value={messages.join("\n")}
        style={styles.chat}
      ></textarea>
      <div style={styles.messageContainer}>
        <input
          type="text"
          value={message}
          placeholder="Escribe un mensaje"
          onChange={(e) => setMessage(e.target.value)}
          style={styles.messageInput}
        />
        <button onClick={handleSendMessage} style={styles.sendButton}>
          Enviar
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    padding: "10px",
    borderRadius: "8px",
  },
  chat: {
    width: "100%",
    height: "200px",
    backgroundColor: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px",
    resize: "none",
  },
  messageContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "10px",
  },
  messageInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#333",
    color: "white",
    marginRight: "10px",
  },
  sendButton: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
};

export default Chat;
