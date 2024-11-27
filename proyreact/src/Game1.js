import React, { useState, useEffect } from "react";
import { useWebSocket } from "./WebSocketContext";
import "./Game1.css";

const Game1 = () => {
  const socket = useWebSocket();
  const { sendMessage } = socket; // Asegúrate de obtener sendMessage correctamente
  //const socket = useWebSocket(); // Accede al WebSocket desde el contexto
  const [grid, setGrid] = useState([]);
  const [playerPosition, setPlayerPosition] = useState(Math.floor(Math.random() * 110));
  const [ballPosition, setBallPosition] = useState(Math.floor(Math.random() * 110));
  const [players, setPlayers] = useState({});
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username") || "Jugador");
  const [playerColor, setPlayerColor] = useState(generateRandomColor());
  const [currentMessage, setCurrentMessage] = useState("");
  const [isBallMoving, setIsBallMoving] = useState(false); // Estado para verificar si la pelota está en movimiento
  const [countdownValue, setCountdownValue] = useState(null);


  const NUM_COLUMNS = 11;
  const NUM_ROWS = 10;


  useEffect(() => {
    createGrid();

    const handleKeyDown = (e) => movePlayer(e.key);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleServerMessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chatMessage") {
        // Agrega el mensaje al estado de messages
        setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.text}`]);
      }
  
      if (data.type === "updatePosition") {
        setPlayers((prevPlayers) => ({
          ...prevPlayers,
          [data.username]: {
            position: data.position,
            color: prevPlayers[data.username]?.color || generateRandomColor(),
          },
        }));
      }
  
      if (data.type === "initialPositions") {

        setPlayers((prevPlayers) => ({
          ...prevPlayers, // Mantén a los jugadores existentes
          ...data.players, // Agrega los jugadores iniciales del servidor
      }));
      }
    };
  
    if (socket) {
      socket.onmessage = handleServerMessage;
    }
  
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  const createGrid = () => {
    const newGrid = [];
    for (let i = 0; i < NUM_COLUMNS * NUM_ROWS; i++) {
      newGrid.push({ id: i, hasObstacle: i % 11 === 5 });
    }
    setGrid(newGrid);
  };

  useEffect(() => {
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [username]: { position: playerPosition, color: playerColor },
    }));
  }, [username, playerPosition, playerColor]);

  useEffect(() => {
    console.log("Estado actualizado de players:", players);
  }, [players]);
  
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
  
        if (data.type === "initialPositions") {
          setPlayers(data.players);
        }
      };
    }
  }, [socket]);
  
  


  const movePlayer = (key) => {
    setPlayerPosition((prevPosition) => {
      let newPosition = prevPosition;

      if (key === "ArrowUp" && prevPosition >= NUM_COLUMNS) {
        newPosition -= NUM_COLUMNS;
      } else if (key === "ArrowDown" && prevPosition < (NUM_ROWS - 1) * NUM_COLUMNS) {
        newPosition += NUM_COLUMNS;
      } else if (key === "ArrowLeft" && prevPosition % NUM_COLUMNS !== 0) {
        newPosition -= 1;
      } else if (key === "ArrowRight" && prevPosition % NUM_COLUMNS !== NUM_COLUMNS - 1) {
        newPosition += 1;
      }

      // Envía la nueva posición al servidor
      sendMessage({
        type: "updatePosition",
        username: username,
        position: newPosition,
      });

      return newPosition;
    });
  };


  const handleMessageSend = (message) => {
    if (!message.trim()) return; // Evita enviar mensajes vacíos
  
    sendMessage({
      type: "chatMessage",
      username: username,
      text: message,
    });
  
    setCurrentMessage(""); // Limpia el input después de enviar
  };
  
  
  console.log("Renderizando jugadores:", players);
  return (
    <div
    className="game-container"
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
                src="/images/favicon.png"
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
            {Object.entries(players).map(([name, { position, color }]) => {
              console.log(`Renderizando jugador: ${name}, posición: ${position}`);
              return position === index ? (
                <div
                  key={name}
                  className="player"
                  style={{
                    backgroundColor: color,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
              ) : null;
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
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)} // Actualiza el estado
              style={styles.messageInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleMessageSend(currentMessage);
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

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/*
const launchBall = (startPosition) => {
  if (isBallMovingRef.current) {
    console.log("La pelota ya está en movimiento.");
    return; // Evita lanzar la pelota si ya está en movimiento
  }

  console.log(`Lanzando pelota desde posición: ${startPosition}`);
  isBallMovingRef.current = true; // Marca la pelota como en movimiento

  // Limpiar cualquier intervalo existente antes de crear uno nuevo
  if (ballIntervalRef.current) {
    clearInterval(ballIntervalRef.current);
  }

  ballIntervalRef.current = setInterval(() => {
    setBallPosition((prevPosition) => {
      const newPosition = prevPosition + 1; // Mover hacia la derecha
      console.log(`Pelota moviéndose a la posición: ${newPosition}`);

      // Verificar si la pelota ha llegado al borde o al final del tablero
      if (newPosition % NUM_COLUMNS === 0 || newPosition >= NUM_COLUMNS * NUM_ROWS) {
        console.log("Pelota llegó al borde.");
        clearInterval(ballIntervalRef.current); // Detener el intervalo
        isBallMovingRef.current = false; // Marca la pelota como no en movimiento
        placeBallRandomly(); // Reubicar la pelota en una posición aleatoria
        return prevPosition; // No mover más allá del borde
      }

      ballPositionRef.current = newPosition; // Sincronizar referencia
      return newPosition; // Actualizar la posición de la pelota
    });
  }, 200); // Tiempo de actualización (200 ms)
};

const placeBallRandomly = () => {
  let newBallPosition;
  do {
    newBallPosition = Math.floor(Math.random() * (NUM_COLUMNS * NUM_ROWS));
  } while (newBallPosition === playerPosition);

  console.log(`Nueva posición de la pelota: ${newBallPosition}`);
  setBallPosition(newBallPosition);
  ballPositionRef.current = newBallPosition; // Sincronizar referencia
  isBallMovingRef.current = false; // Marca la pelota como no en movimiento
};
*/

const styles = {
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


export default Game1;
