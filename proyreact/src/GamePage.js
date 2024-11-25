import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "./WebSocketContext";


const GamePage = () => {
  // Estados para manejar el juego
  const [username, setUsername] = useState(localStorage.getItem("username") || "Jugador");
  const [playerColor, setPlayerColor] = useState("");
  const [gridCells, setGridCells] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(Math.floor(Math.random() * 110));
  const [ballPosition, setBallPosition] = useState(-1);
  const [isBallOnBoard, setIsBallOnBoard] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState(new Set());
  const [countdownValue, setCountdownValue] = useState(null);
  const [messages, setMessages] = useState([]);
  const playerPositionRef = useRef(playerPosition);
  const [players, setPlayers] = useState({});
  const socket = useWebSocket(); // Obtén el WebSocket desde el contexto
  // Inicializa el WebSocket y el tablero al cargar la página
  useEffect(() => {
    // Inicializa el tablero y configura colores
    createGrid();
    setPlayerColor(generateRandomColor());
    placeBall();
    playerPositionRef.current = playerPosition;
  
    // Configura el evento keydown
    const keyDownHandler = (event) => {
      let newPosition = playerPositionRef.current; // Copia la posición actual
  
      switch (event.key) {
        case "ArrowUp":
          if (newPosition >= 11) newPosition -= 11; // Subir una fila
          break;
        case "ArrowDown":
          if (newPosition < 99) newPosition += 11; // Bajar una fila
          break;
        case "ArrowLeft":
          if (newPosition % 11 !== 0) newPosition -= 1; // Mover a la izquierda
          break;
        case "ArrowRight":
          if (newPosition % 11 !== 10) newPosition += 1; // Mover a la derecha
          break;
        default:
          return; // Ignorar otras teclas
      }
  
      console.log(`Posición calculada: ${newPosition}, Fila: ${Math.floor(newPosition / 11)}, Columna: ${newPosition % 11}`);
      console.log("Nueva posición calculada:", newPosition);
  
      setPlayerPosition(newPosition); // Actualiza la posición del jugador
      playerPositionRef.current = newPosition; // Actualiza la referencia

      // Enviar la nueva posición al servidor
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "playerMove",
            username,
            position: newPosition,
          })
        );
      }
    };
  
    // Agregar el evento keydown
    window.addEventListener("keydown", keyDownHandler);
  
    // Cleanup al desmontar el componente
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [socket, playerPosition]); // Dependencias de socket y posición actual del jugador
  

  const handleSocketMessage = (data) => {
    switch (data.type) {
      case "playerMove":
        setPlayers((prev) => ({
        ...prev,
        [data.username]: data.position,
      }));
        break;
      case "ballUpdate":
        setBallPosition(data.position);
        setIsBallOnBoard(true);
        break;
      case "playerEliminated":
        console.log('${data.username} fue eliminado');
        break;
      case "message":
        setMessages((prev) => [...prev, '${data.username}: ${data.text}']);
        break;
      default:
        console.log("Mensaje no manejado:", data);
    }
  };

  const createGrid = () => {
    const newGridCells = [];
    for (let i = 0; i < 110; i++) {
      newGridCells.push({ id: i, hasObstacle: i % 11 === 5 });
    }
    setGridCells(newGridCells);
  };

  const placeBall = () => {
    const newPosition = Math.floor(Math.random() * 110);
    setBallPosition(newPosition);
    setIsBallOnBoard(true);
  };

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const sendMessage = (text) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message = { type: "message", username, text };
      socket.send(JSON.stringify(message));
    }
  };

  const handleKeyDown = (event) => {
    let newPosition = playerPosition;
  
    switch (event.key) {
      case "ArrowUp":
        if (newPosition >= 11) newPosition -= 11; // Subir una fila
        console.log( "up",newPosition);
        break;
      case "ArrowDown":
        if (newPosition < 99) newPosition += 11; // Bajar una fila
        console.log("down", newPosition);

        break;
      case "ArrowLeft":
        if (newPosition % 11 !== 0) newPosition -= 1; // Mover a la izquierda
        console.log( "left",newPosition);

        break;
      case "ArrowRight":
        if (newPosition % 11 !== 10) newPosition += 1; // Mover a la derecha
        console.log("right", newPosition);
        break;
      default:
        return; // Ignorar otras teclas
    }

    setPlayerPosition(newPosition);
     // Enviar la nueva posición al servidor
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "playerMove",
        username,
        position: newPosition,
      })
    );
  }
  
  };
  

  return (
    <div style={styles.body}>
      <div id="topContainer" style={styles.topContainer}>
        <button
          onClick={() => (window.location.href = "/")}
          style={styles.backButton}
        >
          Volver al menú
        </button>
      </div>

      <div id="mainContainer" style={styles.mainContainer}>
        <div id="grid" style={styles.grid}>
          {gridCells.map((cell, index) => (
            <div
              key={index}
              style={{
                ...styles.cell,
                backgroundImage: cell.hasObstacle ? "url('/images/barrier.webp')" : "url('/images/floor.jpg')",
                backgroundSize: "cover", // Hace que la imagen cubra toda la celda
                backgroundPosition: "center", // Centra la imagen dentro de la celda
                backgroundRepeat: "no-repeat", // Evita que la imagen se repita
              }}
            >
              {index === ballPosition && <div style={styles.ball}></div>}
              
              {Object.entries(players).map(([username, position]) => {
                console.log(`Jugador: ${username}, Posición: ${position}, Index actual: ${index}`);
                 if (position === index) {
                  console.log(`Renderizando jugador ${username} en la celda ${index}`);
                  return (
                    <div
                      key={username}
                      style={{
                        ...styles.player,
                        backgroundColor: username === localStorage.getItem("username") ? playerColor : "gray",
                      }}
                    ></div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        <div id="chatContainer" style={styles.chatContainer}>
          <div id="playerName" style={styles.playerName}>
            Jugador: {username}
          </div>
          <textarea
            id="chat"
            readOnly
            value={messages.join("\n")}
            style={styles.chat}
          ></textarea>
          <div id="messageContainer" style={styles.messageContainer}>
            <input
              type="text"
              id="message"
              placeholder="Escribe un mensaje"
              style={styles.messageInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(e.target.value);
              }}
            />
          </div>
          <button id="readyButton" style={styles.readyButton}>
            Listo
          </button>
          {countdownValue !== null && (
            <div id="countdown" style={styles.countdown}>
              ¡Comienza en: {countdownValue}s!
            </div>
          )}
        </div>
      </div>
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
    fontFamily: "'Press Start 2P', cursive",
  },
  topContainer: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "10px",
    zIndex: 1000,
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  mainContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: "60px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(11, 50px)",
    gridTemplateRows: "repeat(10, 50px)",
    gap: "2px",
    marginRight: "10px",
  },
  cell: {
    width: "50px",
    height: "50px",
    border: "1px solid gray",
    position: "relative",
  },
  ball: {
    width: "30px",
    height: "30px",
    backgroundColor: "green",
    borderRadius: "50%",
  },
  player: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    position: "relative",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    padding: "10px",
    borderRadius: "8px",
  },
  playerName: {
    color: "white",
    marginBottom: "10px",
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
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
  },
  messageInput: {
    width: "80%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #555",
    backgroundColor: "#333",
    color: "white",
  },
  readyButton: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  countdown: {
    marginTop: "10px",
    color: "white",
  },
};

export default GamePage;