import React, { useState } from "react";
import Cell from "./Cell";

const size = 5; // 5x5 board

const Board = ({ scores, setScores, currentPlayer, setCurrentPlayer, lines, setLines }) => {
  const [board, setBoard] = useState(Array(size).fill(null).map(() => Array(size).fill(null)));
  const [selectedLetter, setSelectedLetter] = useState("S");

  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horiz, vert, diag, anti-diag
  ];

  const checkSOS = (row, col, player, letter) => {
    const newLines = [];

    directions.forEach(([dx, dy]) => {
      try {
        // Case 1: S _ O _ S
        if (
          letter === "S" &&
          board[row + dx]?.[col + dy] === "O" &&
          board[row + 2 * dx]?.[col + 2 * dy] === "S"
        ) {
          newLines.push({ from: [row, col], to: [row + 2 * dx, col + 2 * dy], player });
        }
        // Case 2: O in the middle
        if (
          letter === "O" &&
          board[row - dx]?.[col - dy] === "S" &&
          board[row + dx]?.[col + dy] === "S"
        ) {
          newLines.push({ from: [row - dx, col - dy], to: [row + dx, col + dy], player });
        }
      } catch {}
    });

    return newLines;
  };

  const handleClick = (row, col) => {
    if (board[row][col]) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = selectedLetter;
    setBoard(newBoard);

    const foundLines = checkSOS(row, col, currentPlayer, selectedLetter);

    if (foundLines.length > 0) {
      const updatedScores = { ...scores };
      if (currentPlayer === 1) updatedScores.player1 += foundLines.length;
      else updatedScores.player2 += foundLines.length;

      setScores(updatedScores);
      setLines([...lines, ...foundLines]);
      // player keeps the turn if scored
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const allFilled = board.every((row) => row.every((cell) => cell));
  let winnerMsg = "";
  if (allFilled) {
    if (scores.player1 > scores.player2) winnerMsg = "🏆 Player 1 Wins!";
    else if (scores.player2 > scores.player1) winnerMsg = "🏆 Player 2 Wins!";
    else winnerMsg = "🤝 It's a Draw!";
  }

  return (
    <div>
      {winnerMsg && <h2 style={{ color: "green" }}>{winnerMsg}</h2>}

      {/* Letter selection buttons */}
      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={() => setSelectedLetter("S")}
          style={{ marginRight: "10px", background: selectedLetter === "S" ? "lightgreen" : "" }}
        >
          Place S
        </button>
        <button
          onClick={() => setSelectedLetter("O")}
          style={{ background: selectedLetter === "O" ? "lightgreen" : "" }}
        >
          Place O
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 60px)`,
          gridTemplateRows: `repeat(${size}, 60px)`,
          position: "relative",
          margin: "0 auto",
          width: `${size * 60}px`,
          height: `${size * 60}px`,
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              value={cell}
              onClick={() => handleClick(rIdx, cIdx)}
            />
          ))
        )}

        {/* Draw lines */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {lines.map((line, idx) => (
            <line
              key={idx}
              x1={line.from[1] * 60 + 30}
              y1={line.from[0] * 60 + 30}
              x2={line.to[1] * 60 + 30}
              y2={line.to[0] * 60 + 30}
              stroke={line.player === 1 ? "red" : "blue"}
              strokeWidth="4"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default Board;
