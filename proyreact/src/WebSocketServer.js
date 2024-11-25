const socketUrl = "ws://localhost:8080/chat";

let socket;

export const connectWebSocket = (onMessageCallback) => {
  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log("WebSocket conectado");
  };

  socket.onmessage = (event) => {
    console.log("Mensaje del servidor:", event.data);
    if (onMessageCallback) {
      onMessageCallback(event.data);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket desconectado");
  };

  socket.onerror = (error) => {
    console.error("Error en WebSocket:", error);
  };
};

export const sendMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.error("WebSocket no está conectado.");
  }
};
