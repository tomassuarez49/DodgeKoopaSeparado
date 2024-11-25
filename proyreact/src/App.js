import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"; // Componente de la página principal
import LoginPage from "./LoginPage"; // Componente de la página de inicio de sesión
import GamePage from "./GamePage"; // Componente de la página de juego
import { WebSocketProvider } from "./WebSocketContext";

const App = () => {
  return (
    <WebSocketProvider>
      <Router>
        <Routes>
          {/* Ruta para la página principal */}
          <Route path="/" element={<HomePage />} />
          {/* Ruta para la página de inicio de sesión */}
          <Route path="/LoginPage" element={<LoginPage />} />
          {/* Ruta para la página de juego */}
          <Route path="/GamePage" element={<GamePage />} />
        </Routes>
      </Router>
    </WebSocketProvider>
  );
};

export default App;
