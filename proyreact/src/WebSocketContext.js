import React, { createContext, useContext, useEffect, useRef } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket("ws://localhost:8080/chat");

      socketRef.current.onopen = () => {
        console.log("WebSocket conectado");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket desconectado");
      };

      socketRef.current.onerror = (error) => {
        console.error("Error en WebSocket:", error);
      };

      socketRef.current.onmessage = (event) => {
        console.log("Mensaje recibido del servidor:", event.data);
      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if(typeof message === "object"){
        socketRef.current.send(JSON.stringify(message));  
      }else{
        socketRef.current.send(message);
      }
      
    } else {
      console.error("WebSocket no está listo para enviar mensajes.");
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
