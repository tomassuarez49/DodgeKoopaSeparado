import React, { useState, useEffect } from "react";
import "./Game1.css"; // Asegúrate de incluir los estilos aquí

const Game1 = () => {
  // Estados
  const [grid, setGrid] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(Math.floor(Math.random() * 110));
  const [ballPosition, setBallPosition] = useState(-1);
  const [players, setPlayers] = useState({});
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username") || "Jugador");
  const [playerColor, setPlayerColor] = useState(generateRandomColor());
  const [readyPlayers, setReadyPlayers] = useState(new Set());
  const [countdown, setCountdown] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(""); // Nuevo estado para el mensaje actual
  const NUM_COLUMNS = 11;
  const NUM_ROWS = 10;

  useEffect(() => {
    // Crear la cuadrícula
    createGrid();
    placeBall();

    // Evento para mover al jugador
    const handleKeyDown = (e) => movePlayer(e.key);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const createGrid = () => {
    const newGrid = [];
    for (let i = 0; i < 110; i++) {
      newGrid.push({ id: i, hasObstacle: i % 11 === 5 });
    }
    setGrid(newGrid);
  };

  const placeBall = () => {
    const position = Math.floor(Math.random() * 110);
    setBallPosition(position);
  };

  const movePlayer = (key) => {
    setPlayerPosition((prevPosition) => {
        const columns = 11; // Número de columnas
        const rows = 10; // Número de filas
        let newPosition = prevPosition;
    
        // Verificar el movimiento y los límites
        if (key === "ArrowUp" && prevPosition >= columns) {
          newPosition -= columns; // Mover hacia arriba
        } else if (key === "ArrowDown" && prevPosition < (rows - 1) * columns) {
          newPosition += columns; // Mover hacia abajo
        } else if (key === "ArrowLeft" && prevPosition % columns !== 0) {
          newPosition -= 1; // Mover hacia la izquierda
        } else if (key === "ArrowRight" && prevPosition % columns !== columns - 1) {
          newPosition += 1; // Mover hacia la derecha
        }
    
        updatePlayers(username, newPosition); // Actualizar los jugadores
        console.log(`Jugador movido a: ${newPosition}`);
        return newPosition; // Actualizar la posición
      });
    
  };

  const updatePlayers = (username, position) => {
    setPlayers((prev) => ({
      ...prev,
      [username]: { position, color: playerColor },
    }));
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      setMessages((prev) => [...prev, { username, text: currentMessage }]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="game-container"
          style={{
        backgroundImage: "url('/images/background_gif.gif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      >
      <div className="top-container">
        <button onClick={() => (window.location.href = "/")} className="back-button">
          Volver al menú
        </button>
      </div>

      <div className="main-container">
        <div id="grid" className="grid">
          {grid.map((cell, index) => (
            <div
              key={cell.id}
              style={{
                width: "50px",
                height: "50px",
                border: "1px dotted gray",
                backgroundImage: cell.hasObstacle
                  ? "url('/images/barrier.webp')"
                  : "url('/images/floor.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className={`cell ${cell.hasObstacle ? "obstacle" : ""}`}
            >
              {index === ballPosition && (
                 <img
                 src="/images/favicon.png" // Reemplaza esto con la ruta de tu imagen
                 alt="Ball"
                 style={{
                   width: "30px",
                   height: "30px",
                   position: "absolute",
                   top: "50%",
                   left: "50%",
                   transform: "translate(-50%, -50%)",
                 }}
               />
             )}
              {Object.entries(players).map(([name, { position, color }]) =>
                position === index ? (
                  <div
                    key={name}
                    className="player"
                    style={{ backgroundColor: color }}
                  ></div>
                ) : null
              )}
            </div>
          ))}
        </div>

        <div className="chat-container">
          <div id="playerName">Jugador: {username}</div>
          <textarea
            id="chat"
            readOnly
            value={messages.map((m) => `${m.username}: ${m.text}`).join("\n")}
            className="chat"
          ></textarea>
          <div id="messageContainer">
            <input
              type="text"
              id="message"
              className="message-input"
              value={currentMessage} 
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(e.target.value);
              }}
            />
          </div>
          <button id="readyButton" className="ready-button">
            Listo
          </button>
          {countdown && <div id="countdown">¡Comienza en: {countdown}s!</div>}
        </div>
      </div>
    </div>
  );
};

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default Game1;
