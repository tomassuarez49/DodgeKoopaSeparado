import React, { createContext, useContext, useEffect, useRef } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socket = useRef(null);

  useEffect(() => {
    // Solo inicializa el WebSocket una vez
    if (!socket.current) {
      socket.current = new WebSocket("ws://localhost:8080/chat");

      socket.current.onopen = () => {
        console.log("WebSocket conectado");
      };

      socket.current.onclose = () => {
        console.log("WebSocket cerrado");
      };

      socket.current.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };

      socket.current.onmessage = (event) => {
        console.log("Mensaje recibido:", event.data);
      };
    }

    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
