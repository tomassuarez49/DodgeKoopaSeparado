import React from "react";
import { useNavigate } from "react-router-dom"; // IMPORTA useNavigate

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      {/* Contenido principal */}
      <h1>Dodge Koopa</h1>
      <h1>Bienvenido a la página principal</h1>

      <div className="button-container">
        <button onClick={() => navigate("/LoginPage")}>
          Iniciar Sesión
        </button>
        <button onClick={() => (window.location.href = "/register")}>
          Registrarse
        </button>
      </div>

      {/* Estilo en línea */}
      <style>
        {`
          .home-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-image: url('/images/background_gif.gif');
            background-size: cover;
            background-position: center;
            background-color: #f0f0f0;
            font-family: 'Press Start 2P', cursive;
          }
          h1 {
            margin-bottom: 20px;
            color: white;
            font-size: 36px;
            text-shadow: 2px 2px 0px black;
            animation: blink 1s infinite;
          }
          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
          .button-container {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }
          button {
            padding: 15px 30px;
            font-size: 18px;
            color: white;
            background-color: #28a745;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-family: 'Press Start 2P', cursive;
          }
          button:hover {
            background-color: #218838;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
