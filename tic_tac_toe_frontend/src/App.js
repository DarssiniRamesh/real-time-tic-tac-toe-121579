import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * The main App component for the Tic Tac Toe game.
 * - Provides a centered, minimalistic, light-themed Tic Tac Toe grid.
 * - Supports two-player local gameplay, winner/draw detection,
 *   game status, and reset/start controls.
 * - Theme toggling remains, integrating with the rest of the app.
 * - Uses environment variable for displaying a build message (if any).
 */
function App() {
  // Theme (light/dark). Default: light.
  const [theme, setTheme] = useState('light');

  // Tic Tac Toe state.
  const [board, setBoard] = useState(Array(9).fill(null)); // 3x3 grid as flat array
  const [isX, setIsX] = useState(true); // True if X's turn, otherwise O
  const [winner, setWinner] = useState(null); // "X", "O", "draw", or null
  const [gameStarted, setGameStarted] = useState(false);

  // Optional: Example to consume an environment variable (shows build flavor or similar)
  const buildMessage = process.env.REACT_APP_BUILD_MESSAGE;

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleStart = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsX(true);
    setGameStarted(true);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsX(true);
    setGameStarted(false);
  };

  // PUBLIC_INTERFACE
  const handleCellClick = idx => {
    // Don't allow moves if not started, or if cell is filled, or if game over
    if (!gameStarted || winner || board[idx]) return;
    const newBoard = board.slice();
    newBoard[idx] = isX ? "X" : "O";
    setBoard(newBoard);
    setIsX(x => !x);
    // Winner will be computed in next effect
  };

  // Check for winner or draw after every move
  useEffect(() => {
    const checkWinner = (b) => {
      const lines = [
        [0,1,2],[3,4,5],[6,7,8], // rows
        [0,3,6],[1,4,7],[2,5,8], // cols
        [0,4,8],[2,4,6],         // diags
      ];
      for (let [a, bIdx, c] of lines) {
        if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
          return b[a];
        }
      }
      if (b.every(cell => cell)) return 'draw';
      return null;
    };
    const result = checkWinner(board);
    setWinner(result);
  }, [board]);

  // Derived: current player string
  const currentPlayer = isX ? "X" : "O";

  // UI Helper: Render a cell
  function renderCell(idx) {
    return (
      <button
        className="ttt-cell"
        onClick={() => handleCellClick(idx)}
        aria-label={`Mark cell ${idx}`}
        disabled={!!winner || !!board[idx] || !gameStarted}
      >
        {board[idx]}
      </button>
    );
  }

  // UI: Game status header
  function GameStatus() {
    if (!gameStarted) return <div className="status">Welcome! Start the game to play.</div>;
    if (winner === "draw") return <div className="status">It's a draw!</div>;
    if (winner === "X" || winner === "O") return <div className="status">Winner: <span className="winner">{winner}</span></div>;
    return <div className="status">Current turn: <span className="player">{currentPlayer}</span></div>;
  }

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'unset', padding: '2rem 0', background: 'var(--bg-secondary)' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="app-title" style={{ margin: '1rem 0', fontWeight: 700, fontSize: "2.25rem" }}>
          Tic Tac Toe
        </h1>
        <GameStatus />
        <div className="ttt-board-container">
          <div className="ttt-board">
            {[0, 1, 2].map(r => (
              <div className="ttt-row" key={r}>
                {renderCell(r * 3)}
                {renderCell(r * 3 + 1)}
                {renderCell(r * 3 + 2)}
              </div>
            ))}
          </div>
        </div>
        <div className="ttt-controls">
          {!gameStarted ? (
            <button className="ttt-btn ttt-btn-start" onClick={handleStart}>Start</button>
          ) : (
            <button className="ttt-btn ttt-btn-reset" onClick={handleReset}>Reset</button>
          )}
        </div>
        {buildMessage && (
          <div style={{marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {buildMessage}
          </div>
        )}
        <footer className="ttt-footer" style={{ marginTop: '2rem', fontSize: "0.95rem", color: "var(--text-secondary)" }}>
          <span>React Minimal |{' '}
            <a className="App-link" href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">Learn React</a>
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
