"use client";
import { useState, useCallback, useEffect } from "react";

// Color definitions
const COLORS = {
  red: { bg: "#FF3B3B", shadow: "#CC0000", name: "Red" },
  blue: { bg: "#2979FF", shadow: "#1A4FBB", name: "Blue" },
  green: { bg: "#00C853", shadow: "#007A32", name: "Green" },
  yellow: { bg: "#FFD600", shadow: "#C8A600", name: "Yellow" },
  purple: { bg: "#AA00FF", shadow: "#6A00CC", name: "Purple" },
  orange: { bg: "#FF6D00", shadow: "#CC4A00", name: "Orange" },
  cyan: { bg: "#00E5FF", shadow: "#00A0C0", name: "Cyan" },
  pink: { bg: "#FF4081", shadow: "#C0004F", name: "Pink" },
  lime: { bg: "#AEEA00", shadow: "#7AAA00", name: "Lime" },
  teal: { bg: "#1DE9B6", shadow: "#00B085", name: "Teal" },
  indigo: { bg: "#3D5AFE", shadow: "#1A30CC", name: "Indigo" },
  amber: { bg: "#FFAB00", shadow: "#CC8800", name: "Amber" },
};

const COLOR_KEYS = Object.keys(COLORS);

// Generate levels - each level has bottles with mixed colors
// Goal: sort each bottle to have only one color
function generateLevel(levelNum) {
  // Number of color types increases with level
  const numColors = Math.min(2 + Math.floor(levelNum / 3), COLOR_KEYS.length);
  const bottleCapacity = Math.min(3 + Math.floor(levelNum / 10), 6);
  const numEmptyBottles = levelNum < 10 ? 2 : levelNum < 25 ? 3 : 4;
  const numColorBottles = numColors;
  const totalBottles = numColorBottles + numEmptyBottles;

  // Pick colors for this level
  // Use different color combos per level by rotating
  const startIdx = (levelNum * 3) % COLOR_KEYS.length;
  const levelColors = [];
  for (let i = 0; i < numColors; i++) {
    levelColors.push(COLOR_KEYS[(startIdx + i) % COLOR_KEYS.length]);
  }

  // Create a solved state: each filled bottle has one color
  const solved = levelColors.map((color) =>
    Array(bottleCapacity).fill(color)
  );
  // Add empty bottles
  for (let i = 0; i < numEmptyBottles; i++) solved.push([]);

  // Shuffle by doing random valid pours in reverse (scramble)
  const bottles = solved.map((b) => [...b]);
  const moves = (levelNum + 2) * 8;
  for (let m = 0; m < moves; m++) {
    // Find non-empty bottles
    const nonEmpty = bottles
      .map((b, i) => i)
      .filter((i) => bottles[i].length > 0);
    const notFull = bottles
      .map((b, i) => i)
      .filter((i) => bottles[i].length < bottleCapacity);

    if (nonEmpty.length === 0 || notFull.length === 0) break;

    const from = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
    let candidates = notFull.filter((i) => i !== from);
    if (candidates.length === 0) continue;
    const to = candidates[Math.floor(Math.random() * candidates.length)];

    // Pour top of from into to
    const color = bottles[from][bottles[from].length - 1];
    bottles[from].pop();
    bottles[to].push(color);
  }

  return { bottles, bottleCapacity, levelColors };
}

// Check if level is solved
function isSolved(bottles, bottleCapacity) {
  return bottles.every(
    (b) =>
      b.length === 0 ||
      (b.length === bottleCapacity && b.every((c) => c === b[0]))
  );
}

// Pour from one bottle to another
function pourBottle(bottles, from, to, capacity) {
  if (from === to) return null;
  if (bottles[from].length === 0) return null;
  if (bottles[to].length >= capacity) return null;

  const fromTop = bottles[from][bottles[from].length - 1];
  const toTop =
    bottles[to].length > 0
      ? bottles[to][bottles[to].length - 1]
      : null;

  if (toTop !== null && toTop !== fromTop) return null;

  // Count how many of fromTop are on top of from
  let count = 0;
  for (let i = bottles[from].length - 1; i >= 0; i--) {
    if (bottles[from][i] === fromTop) count++;
    else break;
  }

  const space = capacity - bottles[to].length;
  const pour = Math.min(count, space);
  if (pour === 0) return null;

  const newBottles = bottles.map((b) => [...b]);
  for (let i = 0; i < pour; i++) {
    newBottles[from].pop();
    newBottles[to].push(fromTop);
  }
  return newBottles;
}

// Bottle SVG component
function Bottle({ bottle, capacity, selected, onClick, solved: bottleSolved }) {
  const fillRatio = bottle.length / capacity;

  // Group consecutive same colors from bottom
  const segments = [];
  let i = 0;
  while (i < bottle.length) {
    let j = i;
    while (j < bottle.length && bottle[j] === bottle[i]) j++;
    segments.push({ color: bottle[i], count: j - i });
    i = j;
  }

  const bottleH = 160;
  const bottleW = 60;
  const neckH = 30;
  const bodyH = bottleH - neckH;
  const segmentH = bodyH / capacity;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "transform 0.15s",
        transform: selected ? "translateY(-18px) scale(1.08)" : "translateY(0) scale(1)",
        filter: bottleSolved
          ? "drop-shadow(0 0 12px #00ff88)"
          : selected
          ? "drop-shadow(0 0 10px #ffffff88)"
          : "none",
      }}
    >
      <svg
        width={bottleW + 20}
        height={bottleH + 20}
        viewBox={`0 0 ${bottleW + 20} ${bottleH + 20}`}
      >
        <defs>
          <clipPath id={`clip-${Math.random()}`}>
            <rect x="10" y="10" width={bottleW} height={bottleH} rx="8" />
          </clipPath>
        </defs>

        {/* Bottle background */}
        <rect
          x="10"
          y="10"
          width={bottleW}
          height={bottleH}
          rx="8"
          fill="rgba(255,255,255,0.08)"
          stroke={selected ? "#ffffff" : bottleSolved ? "#00ff88" : "rgba(255,255,255,0.35)"}
          strokeWidth={selected || bottleSolved ? "2.5" : "1.5"}
        />

        {/* Neck area overlay */}
        <rect
          x="20"
          y="10"
          width={bottleW - 20}
          height={neckH}
          fill="rgba(30,20,80,0.5)"
        />

        {/* Color segments */}
        {segments.map((seg, idx) => {
          const bottomY =
            10 + bottleH - (segments.slice(0, idx + 1).reduce((a, s) => a + s.count, 0)) * segmentH + 0;
          const segH = seg.count * segmentH;
          const color = COLORS[seg.color] || { bg: "#888", shadow: "#444" };
          return (
            <rect
              key={idx}
              x="11"
              y={10 + bottleH - (segments.slice(0, idx + 1).reduce((a, s) => a + s.count, 0)) * segmentH}
              width={bottleW - 2}
              height={segH}
              fill={color.bg}
              opacity="0.92"
              clipPath="url(#bottle-clip)"
            />
          );
        })}

        {/* Bottle glass overlay shine */}
        <rect
          x="16"
          y="14"
          width="8"
          height={bottleH - 8}
          rx="4"
          fill="rgba(255,255,255,0.12)"
        />

        {/* Neck outline */}
        <rect
          x="20"
          y="10"
          width={bottleW - 20}
          height={neckH}
          rx="4"
          fill="none"
          stroke={selected ? "#ffffff" : bottleSolved ? "#00ff88" : "rgba(255,255,255,0.35)"}
          strokeWidth={selected || bottleSolved ? "2.5" : "1.5"}
        />
      </svg>
    </div>
  );
}

// Proper bottle with clipping
function BottleV2({ bottle, capacity, selected, onClick, bottleSolved, index }) {
  const segments = [];
  let i = 0;
  while (i < bottle.length) {
    let j = i;
    while (j < bottle.length && bottle[j] === bottle[i]) j++;
    segments.push({ color: bottle[i], count: j - i });
    i = j;
  }

  const W = 70;
  const H = 180;
  const neckW = 30;
  const neckH = 35;
  const bodyY = neckH;
  const bodyH = H - neckH;
  const segH = bodyH / capacity;
  const clipId = `clip-${index}`;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1)",
        transform: selected ? "translateY(-20px) scale(1.1)" : "translateY(0)",
        filter: bottleSolved
          ? "drop-shadow(0 0 14px #00ff88aa)"
          : selected
          ? "drop-shadow(0 0 12px #ffffffaa)"
          : "none",
      }}
    >
      <svg width={W + 20} height={H + 20} viewBox={`0 0 ${W + 20} ${H + 20}`}>
        <defs>
          <clipPath id={clipId}>
            {/* Body clip */}
            <rect x={10 + (W - neckW) / 2} y={10} width={neckW} height={neckH} rx="5" />
            <rect x="10" y={10 + bodyY} width={W} height={bodyH} rx="10" />
          </clipPath>
        </defs>

        {/* Body */}
        <rect
          x="10"
          y={10 + bodyY}
          width={W}
          height={bodyH}
          rx="10"
          fill="rgba(255,255,255,0.07)"
          stroke={selected ? "#fff" : bottleSolved ? "#00ff88" : "rgba(255,255,255,0.3)"}
          strokeWidth={selected || bottleSolved ? 2.5 : 1.5}
        />

        {/* Neck */}
        <rect
          x={10 + (W - neckW) / 2}
          y="10"
          width={neckW}
          height={neckH + 2}
          rx="5"
          fill="rgba(255,255,255,0.07)"
          stroke={selected ? "#fff" : bottleSolved ? "#00ff88" : "rgba(255,255,255,0.3)"}
          strokeWidth={selected || bottleSolved ? 2.5 : 1.5}
        />

        {/* Color fill segments */}
        <g clipPath={`url(#${clipId})`}>
          {segments.map((seg, idx) => {
            const totalBelow = segments.slice(0, idx).reduce((a, s) => a + s.count, 0);
            const yPos = 10 + bodyY + bodyH - (totalBelow + seg.count) * segH;
            const color = COLORS[seg.color] || { bg: "#888" };
            return (
              <rect
                key={idx}
                x="10"
                y={yPos}
                width={W}
                height={seg.count * segH + 1}
                fill={color.bg}
              />
            );
          })}
        </g>

        {/* Shine */}
        <rect
          x="15"
          y={10 + bodyY + 5}
          width="8"
          height={bodyH - 15}
          rx="4"
          fill="rgba(255,255,255,0.13)"
          clipPath={`url(#${clipId})`}
        />
        {/* Top shine on neck */}
        <rect
          x={10 + (W - neckW) / 2 + 3}
          y="14"
          width="4"
          height={neckH - 6}
          rx="2"
          fill="rgba(255,255,255,0.13)"
          clipPath={`url(#${clipId})`}
        />
      </svg>
    </div>
  );
}

const TOTAL_LEVELS = 50;

export default function WaterSortGame() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [bottles, setBottles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);
  const [coins, setCoins] = useState(0);
  const [animating, setAnimating] = useState(false);

  const loadLevel = useCallback((lvl) => {
    const data = generateLevel(lvl);
    setLevelData(data);
    setBottles(data.bottles);
    setSelected(null);
    setMoves(0);
    setHistory([]);
    setWon(false);
  }, []);

  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel, loadLevel]);

  useEffect(() => {
    if (bottles.length > 0 && levelData && isSolved(bottles, levelData.bottleCapacity)) {
      setWon(true);
      setCoins((c) => c + currentLevel * 10);
    }
  }, [bottles, levelData, currentLevel]);

  const handleBottleClick = (idx) => {
    if (won || animating) return;

    if (selected === null) {
      if (bottles[idx].length === 0) return;
      setSelected(idx);
    } else {
      if (selected === idx) {
        setSelected(null);
        return;
      }
      const newBottles = pourBottle(bottles, selected, idx, levelData.bottleCapacity);
      if (newBottles) {
        setHistory((h) => [...h, bottles]);
        setBottles(newBottles);
        setMoves((m) => m + 1);
      }
      setSelected(null);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBottles(prev);
    setMoves((m) => Math.max(0, m - 1));
    setWon(false);
  };

  const handleRestart = () => {
    loadLevel(currentLevel);
  };

  const handleNextLevel = () => {
    if (currentLevel < TOTAL_LEVELS) {
      setCurrentLevel((l) => l + 1);
    }
  };

  if (!levelData) return null;

  // Layout: up to 7 bottles per row
  const perRow = Math.min(7, bottles.length);
  const rows = [];
  for (let i = 0; i < bottles.length; i += perRow) {
    rows.push(bottles.slice(i, i + perRow).map((b, j) => ({ b, idx: i + j })));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a0a4e 0%, #2d1472 50%, #0d1b6e 100%)",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={handleRestart}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00b8d9, #0065ff)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,100,255,0.4)",
            }}
          >
            ⚙️
          </button>
          <button
            onClick={() => setCurrentLevel((l) => Math.max(1, l - 1))}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00b8d9, #0065ff)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0,100,255,0.4)",
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 1 }}>
            Level {currentLevel}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          <span>{coins}</span>
          <span style={{ fontSize: 26 }}>🪙</span>
        </div>
      </div>

      {/* Game area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 12px",
          gap: 20,
        }}
      >
        {rows.map((row, ri) => (
          <div
            key={ri}
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {row.map(({ b, idx }) => {
              const bSolved =
                b.length === levelData.bottleCapacity &&
                b.every((c) => c === b[0]);
              return (
                <BottleV2
                  key={idx}
                  index={idx}
                  bottle={b}
                  capacity={levelData.bottleCapacity}
                  selected={selected === idx}
                  onClick={() => handleBottleClick(idx)}
                  bottleSolved={bSolved}
                />
              );
            })}
          </div>
        ))}

        {/* Moves counter */}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
          Moves: {moves}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          padding: "16px 24px 28px",
        }}
      >
        <button
          onClick={handleRestart}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #00b8d9, #0065ff)",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            fontSize: 22,
            boxShadow: "0 4px 16px rgba(0,100,255,0.5)",
          }}
          title="Restart"
        >
          🔄
        </button>
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background:
              history.length === 0
                ? "rgba(255,255,255,0.15)"
                : "linear-gradient(135deg, #00b8d9, #0065ff)",
            border: "none",
            cursor: history.length === 0 ? "not-allowed" : "pointer",
            color: "#fff",
            fontSize: 22,
            position: "relative",
            boxShadow: history.length > 0 ? "0 4px 16px rgba(0,100,255,0.5)" : "none",
          }}
          title="Undo"
        >
          ↩️
          {history.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#FFD600",
                color: "#000",
                borderRadius: "50%",
                width: 20,
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {history.length}
            </span>
          )}
        </button>
      </div>

      {/* Win overlay */}
      {won && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1a0a4e, #2d1472)",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: 24,
              padding: "40px 48px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
              Level {currentLevel} Complete!
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>
              Solved in {moves} moves
            </p>
            <p style={{ color: "#FFD600", fontSize: 20, fontWeight: 700, marginBottom: 28 }}>
              +{currentLevel * 10} 🪙
            </p>
            {currentLevel < TOTAL_LEVELS ? (
              <button
                onClick={handleNextLevel}
                style={{
                  background: "linear-gradient(135deg, #00C853, #00796B)",
                  border: "none",
                  borderRadius: 50,
                  padding: "14px 40px",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0,200,83,0.4)",
                }}
              >
                Next Level →
              </button>
            ) : (
              <div style={{ fontSize: 22, fontWeight: 700, color: "#FFD600" }}>
                🏆 All 50 Levels Complete!
              </div>
            )}
            <br />
            <button
              onClick={handleRestart}
              style={{
                marginTop: 12,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 50,
                padding: "10px 28px",
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Replay Level
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}