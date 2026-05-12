"use strict";

//TODO: Think of this view as your game board.
//      Your view should listen to various custom events of your model.
//      For each event of your model, there should be a clear visual
//      representation of what's going on.

const VIEW = {
    init() {
        document.addEventListener("connectfour:playerchange", (event) => {
            this.showCurrentPlayer(event.detail.currentPlayer);
        });

        document.addEventListener("connectfour:stonechange", (event) => {
            this.updateField(event.detail.board);
        });

        document.addEventListener("connectfour:gameover", (event) => {
            this.showGameOver(event.detail);
        });
    },


//TODO: Update the field. Show the whole battlefield with all the stones
//      that are already played.

    updateField(board) {
        const BOARD_ELEMENT = document.querySelector("#board");

        BOARD_ELEMENT.innerHTML = "";

        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[row].length; column++) {
                const CELL = document.createElement("button");

                CELL.classList.add("cell");
                CELL.dataset.row = row;
                CELL.dataset.column = column;

                if (board[row][column] !== null) {
                    CELL.classList.add(board[row][column]);
                }

                BOARD_ELEMENT.appendChild(CELL);
            }
        }
    },



//TODO: Show the current player
    showCurrentPlayer(currentPlayer) {
        const STATUS_ELEMENT = document.querySelector("#status");

        if (currentPlayer === "red") {
            STATUS_ELEMENT.textContent = "Rot ist am Zug";
        } else {
            STATUS_ELEMENT.textContent = "Gelb ist am Zug";
        }
    },

//TODO: Notify the player when the game is over. Make it clear how the
//      Game ended. If it's a win, show the winning stones.

    showGameOver(detail) {
        const STATUS_ELEMENT = document.querySelector("#status");

        if (detail.gameOverReason === "draw") {
            STATUS_ELEMENT.textContent = "Unentschieden";
            return;
        }
        if (detail.winner === "red") {
            STATUS_ELEMENT.textContent = "Rot hat gewonnen!";
        } else {
            STATUS_ELEMENT.textContent = "Gelb hat gewonnen!";
        }

        for (const STONE of detail.winningStones) {
            for (const STONE of detail.winningStones) {
                const WINNING_CELL = document.querySelector(
                    "[data-row='" + STONE.row + "'][data-column='" + STONE.column + "']"
                );

                WINNING_CELL.classList.add("Winner");
            }
        }
    },
}
