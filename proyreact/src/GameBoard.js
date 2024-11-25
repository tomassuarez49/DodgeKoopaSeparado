import React, { useEffect, useState } from "react";

const GameBoard = ({ gridCells, ballPosition, playerPosition, playerColor }) => {
  return (
    <div style={styles.grid}>
      {gridCells.map((cell, index) => (
        <div
          key={index}
          style={{
            ...styles.cell,
            backgroundColor: cell.hasObstacle ? "black" : "transparent",
          }}
        >
          {/* Renderizar pelota */}
          {index === ballPosition && <div style={styles.ball}></div>}

          {/* Renderizar jugador */}
          {index === playerPosition && (
            <div
              style={{
                ...styles.player,
                backgroundColor: playerColor,
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(11, 50px)",
    gridTemplateRows: "repeat(10, 50px)",
    gap: "2px",
    border: "2px solid gray",
  },
  cell: {
    width: "50px",
    height: "50px",
    border: "1px solid gray",
  },
  ball: {
    width: "30px",
    height: "30px",
    backgroundColor: "red",
    borderRadius: "50%",
  },
  player: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

export default GameBoard;
