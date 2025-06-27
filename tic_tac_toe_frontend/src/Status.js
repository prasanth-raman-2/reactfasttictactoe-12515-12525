import React from "react";

// PUBLIC_INTERFACE
function Status({ winner, draw, currentPlayer, message }) {
  /**
   * Status bar for displaying winner, player's turn, or messages.
   * @param {string|null} winner - "X"|"O"|null
   * @param {boolean} draw - true if game is draw
   * @param {string} currentPlayer - "X"|"O"
   * @param {string} message - status or error message
   */
  let status = "";
  if (winner) {
    status = `Winner: ${winner}!`;
  } else if (draw) {
    status = "It's a draw!";
  } else {
    status = `Current turn: ${currentPlayer}`;
  }
  return (
    <div className="ttt-status">
      <div className="ttt-status-main">{status}</div>
      {message && <div className="ttt-status-msg">{message}</div>}
    </div>
  );
}

export default Status;
