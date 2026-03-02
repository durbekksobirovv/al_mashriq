"use client";
import { useState, useCallback } from "react";

const ROWS = 8;
const COLS = 8;

function initBoard() {
  const board = Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: "black", king: false };
    }
  }
  for (let r = 5; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if ((r + c) % 2 === 1) board[r][c] = { color: "red", king: false };
    }
  }
  return board;
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

function getJumps(board, r, c, piece) {
  const jumps = [];
  const dirs = piece.king
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.color === "red"
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];

  for (const [dr, dc] of dirs) {
    const mr = r + dr,
      mc = c + dc;
    const lr = r + 2 * dr,
      lc = c + 2 * dc;
    if (lr >= 0 && lr < ROWS && lc >= 0 && lc < COLS) {
      const mid = board[mr]?.[mc];
      if (mid && mid.color !== piece.color && !board[lr][lc]) {
        jumps.push({ to: [lr, lc], over: [mr, mc] });
      }
    }
  }
  return jumps;
}

function getMoves(board, r, c, piece) {
  const moves = [];
  const dirs = piece.king
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.color === "red"
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ];

  for (const [dr, dc] of dirs) {
    const nr = r + dr,
      nc = c + dc;
    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !board[nr][nc]) {
      moves.push({ to: [nr, nc], over: null });
    }
  }
  return moves;
}

function getAllJumpers(board, color) {
  const jumpers = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r][c];
      if (p && p.color === color && getJumps(board, r, c, p).length > 0) {
        jumpers.push([r, c]);
      }
    }
  }
  return jumpers;
}

function checkWinner(board) {
  let reds = 0,
    blacks = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      if (board[r][c]?.color === "red") reds++;
      if (board[r][c]?.color === "black") blacks++;
    }
  if (reds === 0) return "black";
  if (blacks === 0) return "red";
  return null;
}

export default function Shashka() {
  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("red");
  const [validMoves, setValidMoves] = useState([]);
  const [mustJump, setMustJump] = useState(false);
  const [chainPiece, setChainPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("Qizil o'yinchi boshlaydi!");

  const selectPiece = useCallback((r, c, currentBoard, currentTurn, chain) => {
    const piece = currentBoard[r][c];
    if (!piece || piece.color !== currentTurn) return;

    const jumpers = getAllJumpers(currentBoard, currentTurn);
    const forced = jumpers.length > 0;

    if (forced && !jumpers.some(([jr, jc]) => jr === r && jc === c)) {
      setMessage("Majburiy sakrash kerak!");
      return;
    }

    const jumps = getJumps(currentBoard, r, c, piece);
    const moves = forced || chain ? [] : getMoves(currentBoard, r, c, piece);
    const all = [...jumps, ...moves];

    setSelected([r, c]);
    setValidMoves(all);
    setMustJump(forced);
    setMessage(
      forced
        ? "Sakrash majburiy!"
        : `${currentTurn === "red" ? "Qizil" : "Qora"} o'yinchi harakati`,
    );
  }, []);

  const handleClick = useCallback(
    (r, c) => {
      if (winner) return;

      if (chainPiece) {
        if (chainPiece[0] === r && chainPiece[1] === c) return;
      }

      if (selected && validMoves.some((m) => m.to[0] === r && m.to[1] === c)) {
        const move = validMoves.find((m) => m.to[0] === r && m.to[1] === c);
        const nb = cloneBoard(board);
        const piece = nb[selected[0]][selected[1]];

        nb[r][c] = piece;
        nb[selected[0]][selected[1]] = null;

        if (move.over) nb[move.over[0]][move.over[1]] = null;

        if (
          (piece.color === "red" && r === 0) ||
          (piece.color === "black" && r === ROWS - 1)
        ) {
          nb[r][c].king = true;
        }

        const w = checkWinner(nb);
        if (w) {
          setBoard(nb);
          setSelected(null);
          setValidMoves([]);
          setChainPiece(null);
          setWinner(w);
          setMessage(`🎉 ${w === "red" ? "Qizil" : "Qora"} g'olib bo'ldi!`);
          return;
        }

        if (move.over) {
          const chainJumps = getJumps(nb, r, c, nb[r][c]);
          if (chainJumps.length > 0) {
            setBoard(nb);
            setSelected([r, c]);
            setValidMoves(chainJumps);
            setChainPiece([r, c]);
            setMessage("Davomiy sakrash mumkin!");
            return;
          }
        }

        const nextTurn = turn === "red" ? "black" : "red";
        setBoard(nb);
        setSelected(null);
        setValidMoves([]);
        setChainPiece(null);
        setTurn(nextTurn);
        setMessage(`${nextTurn === "red" ? "Qizil" : "Qora"} o'yinchi navbati`);
      } else {
        setSelected(null);
        setValidMoves([]);
        setChainPiece(null);
        selectPiece(r, c, board, turn, !!chainPiece);
      }
    },
    [board, selected, validMoves, turn, winner, chainPiece, selectPiece],
  );

  const restart = () => {
    setBoard(initBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("red");
    setMustJump(false);
    setChainPiece(null);
    setWinner(null);
    setMessage("Qizil o'yinchi boshlaydi!");
  };

  const redCount = board.flat().filter((c) => c?.color === "red").length;
  const blackCount = board.flat().filter((c) => c?.color === "black").length;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>♟ SHASHKA</h1>

      <div style={styles.scoreboard}>
        <div style={{ ...styles.scoreBox, borderColor: "#cc2200" }}>
          <span style={{ color: "#ff6644", fontSize: 22 }}>●</span>
          <span style={styles.scoreNum}>{redCount}</span>
          <span style={styles.scoreName}>Qizil</span>
          {turn === "red" && !winner && <span style={styles.turnDot} />}
        </div>
        <div style={styles.msgBox}>{message}</div>
        <div style={{ ...styles.scoreBox, borderColor: "#333" }}>
          <span style={{ color: "#222", fontSize: 22 }}>●</span>
          <span style={styles.scoreNum}>{blackCount}</span>
          <span style={styles.scoreName}>Qora</span>
          {turn === "black" && !winner && (
            <span style={{ ...styles.turnDot, background: "#555" }} />
          )}
        </div>
      </div>

      <div style={styles.boardWrap}>
        <div style={styles.board}>
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isDark = (r + c) % 2 === 1;
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const isValid = validMoves.some(
                (m) => m.to[0] === r && m.to[1] === c,
              );
              const isJump =
                validMoves.find((m) => m.to[0] === r && m.to[1] === c)?.over !=
                null;

              let bg = isDark ? "#6b3000" : "#f5deb3";
              if (isSelected) bg = "#a06020";
              if (isValid) bg = isJump ? "#553300" : "#4a3a00";

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => isDark && handleClick(r, c)}
                  style={{
                    ...styles.cell,
                    background: bg,
                    cursor: isDark ? "pointer" : "default",
                    position: "relative",
                  }}
                >
                  {isValid && (
                    <div
                      style={{
                        position: "absolute",
                        width: isJump ? 18 : 14,
                        height: isJump ? 18 : 14,
                        borderRadius: "50%",
                        background: isJump
                          ? "rgba(255,100,0,0.55)"
                          : "rgba(255,220,0,0.45)",
                        border: `2px solid ${isJump ? "#ff8844" : "#ffdd00"}`,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {cell && (
                    <div
                      style={{
                        ...styles.piece,
                        background:
                          cell.color === "red"
                            ? "radial-gradient(circle at 35% 30%, #ff6644, #880000)"
                            : "radial-gradient(circle at 35% 30%, #555, #111)",
                        boxShadow: isSelected
                          ? `0 0 0 3px #ffd700, 0 4px 12px #000`
                          : `0 3px 8px #0008, inset 0 -3px 6px rgba(0,0,0,0.4)`,
                        transform: isSelected ? "scale(1.12)" : "scale(1)",
                        transition: "transform 0.15s, box-shadow 0.15s",
                      }}
                    >
                      {cell.king && (
                        <span
                          style={{
                            fontSize: 16,
                            lineHeight: 1,
                            userSelect: "none",
                          }}
                        >
                          ♛
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </div>
      </div>

      <button onClick={restart} style={styles.btn}>
        🔄 Qaytadan boshlash
      </button>

      {winner && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{ fontSize: 48 }}>🏆</div>
            <h2
              style={{
                color: "#ffd700",
                fontFamily: "Georgia, serif",
                fontSize: 28,
              }}
            >
              {winner === "red" ? "Qizil" : "Qora"} g'olib!
            </h2>
            <button
              onClick={restart}
              style={{ ...styles.btn, marginTop: 16, fontSize: 16 }}
            >
              Yana o'ynash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 40% 20%, #2d1800 0%, #0d0500 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Georgia', serif",
    color: "#f5deb3",
  },
  title: {
    fontSize: "2.4rem",
    letterSpacing: "10px",
    color: "#d4a017",
    textShadow: "0 0 20px rgba(212,160,23,0.5)",
    marginBottom: "16px",
  },
  scoreboard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    width: "100%",
    maxWidth: 500,
  },
  scoreBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "8px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    borderRadius: 8,
    minWidth: 70,
    position: "relative",
  },
  scoreNum: { fontSize: 22, fontWeight: "bold", color: "#f5deb3" },
  scoreName: { fontSize: 12, color: "#a08060" },
  turnDot: {
    position: "absolute",
    bottom: -8,
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#d4a017",
    boxShadow: "0 0 8px #d4a017",
  },
  msgBox: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    color: "#c8a060",
    background: "rgba(255,255,255,0.03)",
    padding: "8px",
    borderRadius: 8,
    border: "1px solid rgba(212,160,23,0.2)",
  },
  boardWrap: {
    padding: 10,
    background: "linear-gradient(145deg, #5c2a00, #3d1800)",
    borderRadius: 12,
    boxShadow:
      "0 8px 40px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,200,100,0.15)",
    border: "2px solid #6b3800",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 56px)",
    gridTemplateRows: "repeat(8, 56px)",
    border: "2px solid #3d1800",
  },
  cell: {
    width: 56,
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  piece: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffd700",
    fontSize: 18,
    cursor: "pointer",
    border: "2px solid rgba(255,255,255,0.15)",
  },
  btn: {
    marginTop: 18,
    padding: "10px 28px",
    background: "linear-gradient(135deg, #6b3000, #3d1800)",
    color: "#d4a017",
    border: "1px solid #6b3800",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: "Georgia, serif",
    transition: "all 0.2s",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "linear-gradient(145deg, #3d1800, #1a0800)",
    border: "2px solid #d4a017",
    borderRadius: 16,
    padding: "40px 60px",
    textAlign: "center",
    boxShadow: "0 0 60px rgba(212,160,23,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
};
