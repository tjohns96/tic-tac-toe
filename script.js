let xTurn = true;
let canPlay = true;
const gameBoard = (() => {
    const getTurn = () => {
        return (xTurn ? "X" : "O");
    }
    const getCellXCoordinate = (cell) => {
        let cellClassList = cell.classList;
        cellClassList = Array.from(cellClassList);
        xCoord = parseInt(cellClassList[1].split("-")[1]);
        return xCoord;
    }
    const getCellYCoordinate = (cell) => {
        let cellClassList = cell.classList;
        cellClassList = Array.from(cellClassList);
        yCoord = parseInt(cellClassList[2].split("-")[1]);
        return yCoord;
    }
    const makeNewGame = () => {
        const boardCells = document.querySelectorAll(".cell");
        let gameBoardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
        boardCells.forEach(cell => cell.textContent = "");
        boardCells.forEach(cell => cell.addEventListener("click", function () { updateBoard(getCellXCoordinate(cell), getCellYCoordinate(cell), getTurn(), gameBoardArray) }));
    }
    const updateBoard = (x, y, value, gameBoardArray) => {
        if (gameBoardArray[y - 1][x - 1] || !canPlay) {
            return;
        }
        gameBoardArray[y - 1][x - 1] = value;
        let cellToChange = document.querySelector(`.column-${x}.row-${y}`);
        cellToChange.textContent = value;
        checkGameEnd(x, y, gameBoardArray);
        xTurn = !xTurn;
    }
    const checkGameEnd = (x, y, gameBoardArray) => {
        // check for vertical wins  
        if (gameBoardArray[(y - 1) % 3][x - 1] === gameBoardArray[y % 3][x - 1] && gameBoardArray[y % 3][x - 1] === gameBoardArray[(y + 1) % 3][x - 1]) {
            declareWinner(gameBoardArray[y - 1][x - 1]);
        }
        // check for horizontal wins
        else if ((gameBoardArray[y - 1][(x - 1) % 3] === gameBoardArray[y - 1][x % 3] && gameBoardArray[y - 1][x % 3] === gameBoardArray[y - 1][(x + 1) % 3])) {
            declareWinner(gameBoardArray[y - 1][x - 1]);
        }
        // check for diagonal wins
        else if ((x + y) % 2 === 0) {
            if (x === y && ((gameBoardArray[(y - 1) % 3][(x - 1) % 3] === gameBoardArray[y % 3][x % 3] && gameBoardArray[y % 3][x % 3] === gameBoardArray[(y + 1) % 3][(x + 1) % 3]))) {
                declareWinner(gameBoardArray[y - 1][x - 1]);
            }
            else if(x!== y || x === 2){
                if (gameBoardArray[2][0] === gameBoardArray[1][1] && gameBoardArray[1][1] === gameBoardArray[0][2]) {
                    declareWinner(gameBoardArray[y - 1][x - 1]);
                }
            }
        }
    }
    const declareWinner = (winner) => {
        const winnerDeclaration = document.querySelector(".winnerDeclaration");
        winnerDeclaration.textContent = `${winner} is the winner!`;
        canPlay = false;
    }
    return { makeNewGame };
})();
gameBoard.makeNewGame();
