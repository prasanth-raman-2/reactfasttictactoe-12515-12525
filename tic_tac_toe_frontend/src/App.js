import React, { useState, useEffect } from "react";
import "./App.css";
import Board from "./Board";
import Status from "./Status";
import "./Board.css";

// Location of backend API (change if backend is elsewhere)
const BACKEND_URL = "http://localhost:3001";

// PUBLIC_INTERFACE
function App() {
  // Theme management
  const [theme, setTheme] = useState("light");

  // Game state
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Effect to apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  async function startNewGame() {
    setLoading(true);
    setStatusMsg("");
    try {
      const resp = await fetch(`${BACKEND_URL}/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) throw new Error("Failed to start a new game");
      const data = await resp.json();
      setGameId(data.message); // message holds the game_id per API
      setBoard(data.board);
      setWinner(data.winner);
      setIsDraw(data.is_draw);
      setCurrentPlayer(data.current_player);
      setStatusMsg("");
    } catch (e) {
      setStatusMsg("Could not start a new game.");
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  async function handleSquareClick(row, col) {
    if (!gameId || winner || isDraw) return;

    setLoading(true);
    setStatusMsg("");
    try {
      const resp = await fetch(`${BACKEND_URL}/game/${gameId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player: currentPlayer, row, col }),
      });
      const data = await resp.json();
      // API always returns board & status even on error
      setBoard(data.board);
      setCurrentPlayer(data.current_player);
      setWinner(data.winner);
      setIsDraw(data.is_draw);
      setStatusMsg(data.message || "");
    } catch (e) {
      setStatusMsg("Network error: failed to make move.");
    }
    setLoading(false);
  }

  // Initializes new game on first load
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line
  }, []);

  const isBoardDisabled = winner || isDraw || loading;

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <h1 style={{ marginBottom: "12px" }}>Tic Tac Toe</h1>
        <Status
          winner={winner}
          draw={isDraw}
          currentPlayer={currentPlayer}
          message={statusMsg}
        />
        <Board board={board} onSquareClick={handleSquareClick} isDisabled={isBoardDisabled} />
        <button
          style={{
            marginTop: 32,
            padding: "10px 36px",
            borderRadius: 10,
            background: "var(--button-bg)",
            color: "var(--button-text)",
            fontWeight: 600,
            border: "none",
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px rgba(100,100,100,0.08)",
            transition: "background .2s",
            cursor: "pointer",
          }}
          onClick={startNewGame}
          disabled={loading}
          aria-label="Start a new game"
        >
          {loading ? "Loading..." : "New Game"}
        </button>
        <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-secondary)" }}>
          Powered by React & FastAPI
        </div>
      </header>
    </div>
  );
}

export default App;
