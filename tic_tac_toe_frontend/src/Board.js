import React from "react";
import "./Board.css";

// PUBLIC_INTERFACE
function Board({ board, onSquareClick, isDisabled }) {
  /** 
   * Board renders the 3x3 tic-tac-toe grid.
   * @param {Array<Array<string|null>>} board - Current 3x3 board state
   * @param {Function} onSquareClick - Called with (row, col) when a square is clicked
   * @param {Boolean} isDisabled - Whether input is blocked (game over or not user's turn)
   */
  return (
    <div className="ttt-board">
      {board.map((row, rowIdx) => (
        <div className="ttt-board-row" key={rowIdx}>
          {row.map((cell, colIdx) => (
            <button
              className="ttt-square"
              key={colIdx}
              onClick={() => onSquareClick(rowIdx, colIdx)}
              disabled={!!cell || isDisabled}
              aria-label={
                cell
                  ? `Square ${rowIdx + 1}, ${colIdx + 1}, ${cell}`
                  : `Square ${rowIdx + 1}, ${colIdx + 1}`
              }
            >
              {cell || ""}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
