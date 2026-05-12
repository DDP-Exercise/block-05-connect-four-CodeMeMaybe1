"use strict";

//TODO: Think of this model as the game-logic.
//      The model knows everything that is neccessary to manage
//      the game. It knows the players, know who's turn it is,
//      knows all the stones and where they are, knows if the
//      game is over and if so, why (draw or winner). It knows
//      which stones are the winning stones. The model also has
//      sovereignty over the battlefield.
//      First step: Create your model-object with all the properties
//      necessary to store that information.

const MODEL = {
        rows: 6,
        columns: 7,
        players: ["red", "yellow"],
        currentPlayer: "red",

        board: [],

        isGameOver: false,
        gameOverReason: null,

        winner: null,
        winningStones: [],


//TODO: Prepare some customEvents. The model should dispatch events when
//      - The Player Changes
//      - A stone was inserted
//      - The Game is over (Draw or Winner)
//      Don't forget to give your events a namespace.
//      For each customEvent, just make a >method< for your model-object,
//      that, when called, dispatches the event. Nothing else should
//      happen in those methods.

        dispatchPlayerChangeEvent() {
            document.dispatchEvent(new CustomEvent("connectfour:playerchange", {
                detail: {
                    currentPlayer: this.currentPlayer
                }
            }));
        },

        dispatchStoneChangeEvent() {
            document.dispatchEvent(new CustomEvent("connectfour:stonechange", {
                detail: {
                    board: this.board
                }
            }));
        },

        dispatchGameOverEvent() {
            document.dispatchEvent(new CustomEvent("connectfour:gameover", {
                detail: {
                    gameOverReason: this.gameOverReason,
                    winner: this.winner,
                    winningStones: this.winningStones,
                }
            }));
        },

        dispatchWinnerEvent() {
            document.dispatchEvent(new CustomEvent("connectfour:winner", {
                detail: {
                    winner: this.winner,
                    winningStones: this.winningStones
                }
            }));
        },


//TODO: Initiate the battlefield. Your model needs a representation of the
//      battlefield as data (two-dimensional array). Obviously, there are
//      no stones yet in the field.

        initBattlefield() {
            this.board = [];
            this.isGameOver = false;
            this.gameOverReason = null;
            this.winner = null;
            this.winningStones = [];
            this.currentPlayer = "red";

            for (let row = 0; row < this.rows; row++) {
                const NEW_ROW = [];

                for (let column = 0; column < this.columns; column++) {
                    NEW_ROW.push(null);
                }
                this.board.push(NEW_ROW);
            }
        },

//TODO: The model should offer a method to insert a stone at a given column.
//      If the stone can be inserted, the model should insert the stone,
//      dispatch an event to let the world know that the battlefield has changed
//      and check if the game is over now.
//      Hint: This method will be called later by your controller, when the
//      user makes an according input.
        insertStone(column) {
            if (this.isGameOver) {
                return;
            }
            for (let row = this.rows - 1; row >= 0; row--) {
                if (this.board [row][column] === null) {
                    this.board [row][column] = this.currentPlayer;
                    this.dispatchStoneChangeEvent();
                    this.checkGameOver();

                    if (!this.isGameOver) {
                        this.changePlayer();
                    }
                    return;
                }
            }
            alert("Diese Spalte ist voll")
        },

//TODO: Methods to check if the game is over, either by draw or a win.
//      Let the world know in both cases what happend. If it's a win,
//      Don't forget to store the winning stones and add this >detail<
//      to your custom event.

        checkGameOver() {
            if (this.checkWin()) {
                this.isGameOver = true;
                this.gameOverReason = "winner";
                this.winner = this.currentPlayer;
                this.dispatchGameOverEvent();
            }

            if (this.checkDraw()) {
                this.isGameOver = true;
                this.gameOverReason = "draw";
                this.dispatchGameOverEvent();
            }
        },

        checkDraw() {
            for (let column = 0; column < this.columns; column++) {
                if (this.board[0] [column] === null) {
                    return false;
                }
            }
            return true;
        },

        checkWin() {
            for (let row = 0; row < this.rows; row++) {
                for (let column = 0; column < this.columns; column++) {
                    if (this.board[row][column] === this.currentPlayer) {
                        if (this.checkDirection(row, column, 0, 1)) {
                            return true;
                        }

                        if (this.checkDirection(row, column, 1, 0)) {
                            return true;
                        }

                        if (this.checkDirection(row, column, 1, 1)) {
                            return true;
                        }

                        if (this.checkDirection(row, column, 1, -1)) {
                            return true;
                        }
                    }
                }
            }
                return false;
            },
    checkDirection(startRow, startColumn, rowDirection, columnDirection) {
        const STONES = [];
        if (this.board[startRow][startColumn] === null) {
            return false;
        }

        for (let i = 0; i < 4; i++) {
            const ROW = startRow + i * rowDirection;
            const COLUMN = startColumn + i * columnDirection;

            if (ROW < 0 || ROW >= this.rows || COLUMN < 0 || COLUMN >= this.columns) {
                return false;
            }

            if (this.board[ROW][COLUMN] !== this.currentPlayer) {
                return false;
            }

            STONES.push({
                row: ROW,
                column: COLUMN,
            });
        }
        this.winningStones = STONES;
        return true;
    },


//TODO: Method to change the current player (and dispatch the according event).
    changePlayer () {
        if (this.currentPlayer === "red") {
            this.currentPlayer = "yellow";
        } else {
            this.currentPlayer = "red";
        }
        this.dispatchPlayerChangeEvent();
    }
};