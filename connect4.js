class Game {
    constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
        this.players = [p1, p2];
        this.HEIGHT = HEIGHT;
        this.WIDTH = WIDTH;
        this.currPlayer = p1;
        this.makeBoard();
        this.makeHtmlBoard();
        this.gameOver = false;
    }

    makeBoard() {
        this.board = [];
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
        }
    }

    makeHtmlBoard() {
        const board = document.getElementById("board");

        const top = document.createElement("tr");
        top.setAttribute("id", "column-top");

        this.handleGameClick = this.handleClick.bind(this);

        top.addEventListener("click", handleClick);

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement("td");
            headCell.setAttribute("id", x);
            top.append(headCell);
        }

        board.append(top);

        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement("tr");

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement("td");
                cell.setAttribute("id", `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    }

    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    }

    placeInTable(y, x) {
        const piece = document.createElement("div");
        piece.classList.add("piece");
        piece.classList.add(`p${this.currPlayer}`);
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    /** endGame: announce game end */
    endGame(msg) {
        alert(msg);
        const top = document.querySelector("#column-top");
        top.removeEventListener("click", this.handleGameClick);
    }

    /** handleClick: handle click of column top to play piece */

    handleClick(evt) {
        // get x from ID of clicked cell
        const x = +evt.target.id;

        // get next spot in column (if none, ignore click)
        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }

        // place piece in board and add to HTML table
        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        // check for win
        if (this.checkForWin()) {
            this.gameOver = true;
            return this.endGame(`Player ${this.currPlayer} won!`);
        }

        // check for tie
        if (this.board.every((row) => row.every((cell) => cell))) {
            return this.endGame("Tie!");
        }

        // switch players
        this.currPlayer = currPlayer === 1 ? 2 : 1;
    }

    /** checkForWin: check board cell-by-cell for "does a win start here?" */

    checkForWin() {
        const _win = (cells) =>
            // Check four cells to see if they're all color of current player
            //  - cells: list of four (y, x) cells
            //  - returns true if all are legal coordinates & all match currPlayer

            cells.every(
                ([y, x]) =>
                    y >= 0 &&
                    y < this.HEIGHT &&
                    x >= 0 &&
                    x < this.WIDTH &&
                    board[y][x] === this.currPlayer
            );

        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3],
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x],
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3],
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3],
                ];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}

class Player {
    constructor(color) {
        this.color = color;
    }
}

document.getElementById("start-game").addEventListener("click", () => {
    let p1 = new Player(document.getElementById("p1-color").value);
    let p2 = new Player(document.getElementById("p2-color").value);
    new Game(p1, p2);
});
