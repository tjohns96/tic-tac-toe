let xTurn = true;
const gameBoard = (() => {
    const trackTurn = () => {
        xTurn = !xTurn;
        return (xTurn ? "O" : "X");
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
        boardCells.forEach(cell => cell.addEventListener("click", function () { updateBoard(getCellXCoordinate(cell), getCellYCoordinate(cell), trackTurn(), gameBoardArray) }));
    }
    const updateBoard = (x, y, value, gameBoardArray) => {
        gameBoardArray[y - 1][x - 1] = value;
        let cellToChange = document.querySelector(`.column-${x}.row-${y}`);
        cellToChange.textContent = value;
    }
    return { makeNewGame };
})();
gameBoard.makeNewGame();
