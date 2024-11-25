import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTA useNavigate
import { useWebSocket } from "./WebSocketContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [gameOption, setGameOption] = useState("play");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const socket = useWebSocket();  
  

  const handleInputChange = (event) => {
    const value = event.target.value.replace(/[^a-zA-Z0-9_.-]/g, "");
    setUsername(value);
    setIsButtonDisabled(value.trim() === "" || isGameStarted);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isGameStarted) {
      alert("Esta partida está comenzada, espera a que termine.");
      return;
    }

    // Guarda el nombre de usuario en localStorage
    localStorage.setItem("username", username);
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Opcional: envía un mensaje al servidor para notificar el inicio de sesión
      socket.send(JSON.stringify({ type: "login", username }));
    }

    if (gameOption === "play") {
        navigate("/GamePage");
    } else if (gameOption === "join") {
      window.location.href = "/join";
    } else if (gameOption === "create") {
      window.location.href = "/create_game";
    }
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.title}>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={username}
          onChange={handleInputChange}
          style={styles.input}
          required
        />
        <select
          value={gameOption}
          onChange={(e) => setGameOption(e.target.value)}
          style={styles.input}
        >
          <option value="play">Jugar</option>
          <option value="join">Unirse</option>
          <option value="create">Crear</option>
        </select>
        <div style={styles.buttonContainer}>
          <button
            id="submitButton"
            type="submit"
            disabled={isButtonDisabled}
            style={isButtonDisabled ? styles.disabledButton : styles.button}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            style={styles.button}
          >
            Volver a la página principal
          </button>
        </div>
      </form>
      {isGameStarted && (
        <div style={styles.errorMessage}>
          Esta partida está comenzada, espera a que termine y podrás ingresar.
        </div>
      )}
    </div>
  );
};

const styles = {
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: "url('/images/background_gif.gif')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "#f0f0f0",
    fontFamily: "'Press Start 2P', cursive",
  },
  title: {
    marginBottom: "20px",
    color: "white",
    fontSize: "36px",
    textShadow: "2px 2px 0px black",
    animation: "blink 1s infinite",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    margin: "10px 0",
    padding: "10px",
    width: "220px",
    fontSize: "16px",
    border: "2px solid #007bff",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    color: "white",
    backgroundColor: "#28a745",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontFamily: "'Press Start 2P', cursive",
  },
  disabledButton: {
    padding: "15px 30px",
    fontSize: "18px",
    color: "white",
    backgroundColor: "#cccccc",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
  },
  errorMessage: {
    display: "block",
    color: "red",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "20px",
  },
};

export default LoginPage;
