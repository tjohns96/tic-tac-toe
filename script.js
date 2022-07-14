let xTurn = true;
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
        xTurn = true;
        const winnerDeclaration = document.querySelector(".winner-declaration");
        winnerDeclaration.textContent = "";
        const boardCells = document.querySelectorAll(".cell");
        let gameBoardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
        boardCells.forEach(cell => cell.textContent = "");
        boardCells.forEach(cell => cell.addEventListener("click", function () { updateBoard(getCellXCoordinate(cell), getCellYCoordinate(cell), getTurn(), gameBoardArray) }));
    }
    const updateBoard = (x, y, value, gameBoardArray) => {
        if (gameBoardArray[y - 1][x - 1]) {
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
            else if (x !== y || x === 2) {
                if (gameBoardArray[2][0] === gameBoardArray[1][1] && gameBoardArray[1][1] === gameBoardArray[0][2]) {
                    declareWinner(gameBoardArray[y - 1][x - 1]);
                }
            }
        }
    }
    const declareWinner = (winner) => {
        const winnerDeclaration = document.querySelector(".winner-declaration");
        winnerDeclaration.textContent = `${winner} is the winner!`;
        endGame();
    }
    const endGame = () => {
        boardCells = document.querySelectorAll(".cell");
        boardCells.forEach(cell => replaceCell(cell));
        addReplayButton();
    }
    const replaceCell = (cell) => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    }
    const addReplayButton = () => {
        const board = document.querySelector(".gameboard");
        const replayButton = document.createElement("button");
        replayButton.textContent = "Replay";
        replayButton.setAttribute("type", "button");
        replayButton.classList.add("replay");
        replayButton.addEventListener("click", makeNewGame);
        replayButton.addEventListener("click", () => replayButton.parentElement.removeChild(replayButton));
        board.appendChild(replayButton);
    }
    return { makeNewGame };
})();
const playerControls = (() => {
    const setPlayerSelect = () => {
        const playerSelect = document.querySelector(".player-select");
        playerSelect.addEventListener("change", function () { toggleDifficultySelect(playerSelect) });
    }
    const toggleDifficultySelect = (playerSelect) => {
        if (playerSelect.value === "computer") {
            const playerSelectArea = document.querySelector(".player-select-area");
            let difficultySelect = document.createElement("select");
            difficultySelect.classList.add("difficulty-select");
            let easyOption = document.createElement("option");
            let hardOption = document.createElement("option");
            easyOption.setAttribute("value", "easy");
            hardOption.setAttribute("value", "hard");
            easyOption.textContent = "Easy";
            hardOption.textContent = "Hard";
            difficultySelect.append(easyOption, hardOption);
            playerSelectArea.appendChild(difficultySelect);
        }
        else{
            const difficultySelect = document.querySelector(".difficulty-select");
            difficultySelect.parentElement.removeChild(difficultySelect);
        }
    }
    return { setPlayerSelect };
})();
gameBoard.makeNewGame();
playerControls.setPlayerSelect(); 