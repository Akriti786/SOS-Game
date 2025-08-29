// import React, { useState, useEffect } from "react";
// import "./App.css";

// const SIZE = 10;

// export default function App() {
//   const emptyBoard = Array(SIZE).fill(null).map(() => Array(SIZE).fill(""));
//   const [board, setBoard] = useState(emptyBoard);
//   const [currentPlayer, setCurrentPlayer] = useState(1);
//   const [scores, setScores] = useState({ 1: 0, 2: 0 });
//   const [lines, setLines] = useState([]);
//   const [selectedLetter, setSelectedLetter] = useState("S");
//   const [lastScoreMsg, setLastScoreMsg] = useState(null);
//   const [winner, setWinner] = useState(null);

//   useEffect(() => {
//     if (!lastScoreMsg) return;
//     const id = setTimeout(() => setLastScoreMsg(null), 1400);
//     return () => clearTimeout(id);
//   }, [lastScoreMsg]);

//   const lineKey = (a, b) => {
//     const [r1, c1] = a;
//     const [r2, c2] = b;
//     if (r1 < r2 || (r1 === r2 && c1 <= c2)) return `${r1},${c1}-${r2},${c2}`;
//     return `${r2},${c2}-${r1},${c1}`;
//   };

//   const inBounds = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

//   const findNewSosLines = (newBoard, r, c) => {
//     const directions = [
//       [0, 1],
//       [1, 0],
//       [1, 1],
//       [1, -1],
//     ];
//     const found = [];
//     const existingKeys = new Set(lines.map(l => lineKey(l.start, l.end)));

//     directions.forEach(([dr, dc]) => {
//       const r0 = r - dr, c0 = c - dc;
//       const r2 = r + dr, c2 = c + dc;
//       if (inBounds(r0, c0) && inBounds(r2, c2)) {
//         if (newBoard[r0][c0] === "S" && newBoard[r][c] === "O" && newBoard[r2][c2] === "S") {
//           const key = lineKey([r0, c0], [r2, c2]);
//           if (!existingKeys.has(key)) {
//             found.push({ start: [r0, c0], end: [r2, c2], player: currentPlayer, key });
//             existingKeys.add(key);
//           }
//         }
//       }

//       const r1 = r + dr, c1 = c + dc;
//       const r2b = r + 2 * dr, c2b = c + 2 * dc;
//       if (inBounds(r1, c1) && inBounds(r2b, c2b)) {
//         if (newBoard[r][c] === "S" && newBoard[r1][c1] === "O" && newBoard[r2b][c2b] === "S") {
//           const key = lineKey([r, c], [r2b, c2b]);
//           if (!existingKeys.has(key)) {
//             found.push({ start: [r, c], end: [r2b, c2b], player: currentPlayer, key });
//             existingKeys.add(key);
//           }
//         }
//       }

//       const r0b = r - 2 * dr, c0b = c - 2 * dc;
//       const r1b = r - dr, c1b = c - dc;
//       if (inBounds(r0b, c0b) && inBounds(r1b, c1b)) {
//         if (newBoard[r0b][c0b] === "S" && newBoard[r1b][c1b] === "O" && newBoard[r][c] === "S") {
//           const key = lineKey([r0b, c0b], [r, c]);
//           if (!existingKeys.has(key)) {
//             found.push({ start: [r0b, c0b], end: [r, c], player: currentPlayer, key });
//             existingKeys.add(key);
//           }
//         }
//       }
//     });
//     return found;
//   };

//   const handleCellClick = (r, c) => {
//     if (board[r][c] !== "" || winner) return;

//     const newBoard = board.map(row => row.slice());
//     newBoard[r][c] = selectedLetter;
//     const newSos = findNewSosLines(newBoard, r, c);

//     if (newSos.length > 0) {
//       setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + newSos.length }));
//       setLines(prev => [...prev, ...newSos]);
//       setLastScoreMsg(`Player ${currentPlayer} +${newSos.length} point${newSos.length > 1 ? "s" : ""}`);
//     } else {
//       setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
//     }

//     setBoard(newBoard);

//     const full = newBoard.flat().every(cell => cell !== "");
//     if (full) {
//       setTimeout(() => {
//         if (scores[1] + (currentPlayer === 1 ? newSos.length : 0) > scores[2] + (currentPlayer === 2 ? newSos.length : 0)) {
//           setWinner(`Player 1 wins 🏆`);
//         } else if (scores[2] + (currentPlayer === 2 ? newSos.length : 0) > scores[1] + (currentPlayer === 1 ? newSos.length : 0)) {
//           setWinner(`Player 2 wins 🏆`);
//         } else {
//           setWinner(`It's a draw 🤝`);
//         }
//       }, 80);
//     }
//   };

//   const resetGame = () => {
//     setBoard(emptyBoard.map(row => row.slice()));
//     setCurrentPlayer(1);
//     setScores({ 1: 0, 2: 0 });
//     setLines([]);
//     setSelectedLetter("S");
//     setLastScoreMsg(null);
//     setWinner(null);
//   };

//   const leader = scores[1] > scores[2] ? "Player 1 leading" :
//     scores[2] > scores[1] ? "Player 2 leading" : "Tie";

//   return (
//     <div className="container">
//       <h1>SOS-Game</h1>

//       <div className="top-row">
//         <div className="scoreboard">
//           <div className={`score player1 ${currentPlayer === 1 ? "active" : ""}`}>
//             <div className="dot red" /> Player 1: <strong>{scores[1]}</strong>
//           </div>
//           <div className={`score player2 ${currentPlayer === 2 ? "active" : ""}`}>
//             <div className="dot blue" /> Player 2: <strong>{scores[2]}</strong>
//           </div>
//           <div className="leader">{leader}</div>
//         </div>

//         <div className="controls">
//           <button className={`letter-btn ${selectedLetter === "S" ? "selected" : ""}`} onClick={() => setSelectedLetter("S")}>Place S</button>
//           <button className={`letter-btn ${selectedLetter === "O" ? "selected" : ""}`} onClick={() => setSelectedLetter("O")}>Place O</button>
//           <button onClick={resetGame} className="reset-btn">Reset Game</button>
//         </div>
//       </div>

//       <div className="turn">Turn: <strong>Player {currentPlayer}</strong></div>
//       {lastScoreMsg && <div className="score-msg">{lastScoreMsg}</div>}
//       {winner && <div className="winner-msg">{winner}</div>}

//       <div className="board-wrapper">
//         <div
//           className="board"
//           style={{
//             "--size": SIZE,
//             gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
//             gridTemplateRows: `repeat(${SIZE}, 1fr)`,
//           }}
//         >
//           {board.map((row, r) =>
//             row.map((val, c) => (
//               <div key={`${r}-${c}`} className={`cell ${val === "" ? "empty-cell" : ""}`} onClick={() => handleCellClick(r, c)}>
//                 <div className="cell-val">{val}</div>
//                 {val === "" && <div className="ghost-letter">{selectedLetter}</div>}
//               </div>
//             ))
//           )}
//           <svg className="overlay" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="none">
//             {lines.map((ln) => {
//               const [r1, c1] = ln.start, [r2, c2] = ln.end;
//               return (
//                 <line
//                   key={ln.key}
//                   x1={c1 + 0.5}
//                   y1={r1 + 0.5}
//                   x2={c2 + 0.5}
//                   y2={r2 + 0.5}
//                   stroke={ln.player === 1 ? "red" : "blue"}
//                   strokeWidth={0.08}
//                   strokeLinecap="round"
//                 />
//               );
//             })}
//           </svg>
//         </div>
//       </div>

//       <p className="hint">Click a cell to place the selected letter. Form SOS to score points!</p>
//     </div>
//   );
// }









import React, { useState, useEffect } from "react";
import "./App.css";

const SIZE = 10;

export default function App() {
  const emptyBoard = Array(SIZE).fill(null).map(() => Array(SIZE).fill(""));
  const [board, setBoard] = useState(emptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [lines, setLines] = useState([]);
  const [lastScoreMsg, setLastScoreMsg] = useState(null);
  const [winner, setWinner] = useState(null);
  const [editableCell, setEditableCell] = useState(null); // { row, col, letter }

  useEffect(() => {
    if (!lastScoreMsg) return;
    const id = setTimeout(() => setLastScoreMsg(null), 1400);
    return () => clearTimeout(id);
  }, [lastScoreMsg]);

  const lineKey = (a, b) => {
    const [r1, c1] = a;
    const [r2, c2] = b;
    if (r1 < r2 || (r1 === r2 && c1 <= c2)) return `${r1},${c1}-${r2},${c2}`;
    return `${r2},${c2}-${r1},${c1}`;
  };

  const inBounds = (r, c) => r >= 0 && r < SIZE && c >= 0 && c < SIZE;

  const findNewSosLines = (newBoard, r, c) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    const found = [];
    const existingKeys = new Set(lines.map(l => lineKey(l.start, l.end)));

    directions.forEach(([dr, dc]) => {
      const r0 = r - dr, c0 = c - dc;
      const r2 = r + dr, c2 = c + dc;
      if (inBounds(r0, c0) && inBounds(r2, c2)) {
        if (newBoard[r0][c0] === "S" && newBoard[r][c] === "O" && newBoard[r2][c2] === "S") {
          const key = lineKey([r0, c0], [r2, c2]);
          if (!existingKeys.has(key)) {
            found.push({ start: [r0, c0], end: [r2, c2], player: currentPlayer, key });
            existingKeys.add(key);
          }
        }
      }

      const r1 = r + dr, c1 = c + dc;
      const r2b = r + 2 * dr, c2b = c + 2 * dc;
      if (inBounds(r1, c1) && inBounds(r2b, c2b)) {
        if (newBoard[r][c] === "S" && newBoard[r1][c1] === "O" && newBoard[r2b][c2b] === "S") {
          const key = lineKey([r, c], [r2b, c2b]);
          if (!existingKeys.has(key)) {
            found.push({ start: [r, c], end: [r2b, c2b], player: currentPlayer, key });
            existingKeys.add(key);
          }
        }
      }

      const r0b = r - 2 * dr, c0b = c - 2 * dc;
      const r1b = r - dr, c1b = c - dc;
      if (inBounds(r0b, c0b) && inBounds(r1b, c1b)) {
        if (newBoard[r0b][c0b] === "S" && newBoard[r1b][c1b] === "O" && newBoard[r][c] === "S") {
          const key = lineKey([r0b, c0b], [r, c]);
          if (!existingKeys.has(key)) {
            found.push({ start: [r0b, c0b], end: [r, c], player: currentPlayer, key });
            existingKeys.add(key);
          }
        }
      }
    });
    return found;
  };

  const finalizeCell = ({ row, col, letter }) => {
    const newBoard = board.map(row => row.slice());
    newBoard[row][col] = letter;

    const newSos = findNewSosLines(newBoard, row, col);

    if (newSos.length > 0) {
      setScores(prev => ({ ...prev, [currentPlayer]: prev[currentPlayer] + newSos.length }));
      setLines(prev => [...prev, ...newSos]);
      setLastScoreMsg(`Player ${currentPlayer} +${newSos.length} point${newSos.length > 1 ? "s" : ""}`);
    } else {
      setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    }

    setBoard(newBoard);
    setEditableCell(null);

    const full = newBoard.flat().every(cell => cell !== "");
    if (full) {
      setTimeout(() => {
        const total1 = scores[1] + (currentPlayer === 1 ? newSos.length : 0);
        const total2 = scores[2] + (currentPlayer === 2 ? newSos.length : 0);
        setWinner(
          total1 > total2 ? `Player 1 wins 🏆` :
          total2 > total1 ? `Player 2 wins 🏆` :
          `It's a draw 🤝`
        );
      }, 100);
    }
  };

  const handleCellClick = (r, c) => {
    if (board[r][c] !== "" || winner) return;

    if (editableCell) {
      const { row, col } = editableCell;

      // Same cell — toggle S/O
      if (row === r && col === c) {
        const nextLetter = editableCell.letter === "S" ? "O" : "S";
        setEditableCell({ row, col, letter: nextLetter });
      } else {
        // Different cell — finalize old one, start new
        finalizeCell(editableCell);
        setEditableCell({ row: r, col: c, letter: "S" });
      }
    } else {
      // No cell is being edited — start new one
      setEditableCell({ row: r, col: c, letter: "S" });
    }
  };

  const resetGame = () => {
    setBoard(emptyBoard.map(row => row.slice()));
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setLines([]);
    setLastScoreMsg(null);
    setWinner(null);
    setEditableCell(null);
  };

  const leader = scores[1] > scores[2] ? "Player 1 leading" :
    scores[2] > scores[1] ? "Player 2 leading" : "Tie";

  return (
    <div className="container">
      <h1>SOS-Game</h1>

      <div className="top-row">
        <div className="scoreboard">
          <div className={`score player1 ${currentPlayer === 1 ? "active" : ""}`}>
            <div className="dot red" /> Player 1: <strong>{scores[1]}</strong>
          </div>
          <div className={`score player2 ${currentPlayer === 2 ? "active" : ""}`}>
            <div className="dot blue" /> Player 2: <strong>{scores[2]}</strong>
          </div>
          <div className="leader">{leader}</div>
        </div>

        <div className="controls">
          <button onClick={resetGame} className="reset-btn">Reset Game</button>
        </div>
      </div>

      <div className="turn">Turn: <strong>Player {currentPlayer}</strong></div>
      {lastScoreMsg && <div className="score-msg">{lastScoreMsg}</div>}
      {winner && <div className="winner-msg">{winner}</div>}

      <div className="board-wrapper">
        <div
          className="board"
          style={{
            "--size": SIZE,
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SIZE}, 1fr)`,
          }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const isTemp = editableCell && editableCell.row === r && editableCell.col === c;
              const displayVal = isTemp ? editableCell.letter : val;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`cell ${val === "" ? "empty-cell" : ""}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  <div className="cell-val">{displayVal}</div>
                  {val === "" && !isTemp && <div className="ghost-letter"></div>}
                </div>
              );
            })
          )}
          <svg className="overlay" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="none">
            {lines.map((ln) => {
              const [r1, c1] = ln.start, [r2, c2] = ln.end;
              return (
                <line
                  key={ln.key}
                  x1={c1 + 0.5}
                  y1={r1 + 0.5}
                  x2={c2 + 0.5}
                  y2={r2 + 0.5}
                  stroke={ln.player === 1 ? "red" : "blue"}
                  strokeWidth={0.08}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
      </div>

      <p className="hint">Enjoy the game By:Akriti</p>
    </div>
  );
}
