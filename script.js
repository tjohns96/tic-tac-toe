let xTurn = true;
let playerSide;
let compSide;
let difficulty;
let gameBoardArray;
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
    const makeNewGame = (readyState) => {
        xTurn = true;
        const winnerDeclaration = document.querySelector(".winner-declaration");
        const replayButton = document.querySelector(".replay-button");
        let startButton = document.querySelector(".start-button");
        if (startButton) {
            document.querySelectorAll("*").forEach((item) => {
                item.disabled = false;
            });
        }
        if (replayButton) {
            replayButton.parentElement.removeChild(replayButton);
        }
        winnerDeclaration.textContent = "";
        let boardCells = document.querySelectorAll(".cell");
        gameBoardArray = [["", "", ""], ["", "", ""], ["", "", ""]];
        boardCells.forEach((cell) => {
            replaceCell(cell, false);
        });
        if (readyState) {
            boardCells = document.querySelectorAll(".cell");
            boardCells.forEach(cell => {
                cell.addEventListener("click", function () { updateBoard(getCellXCoordinate(cell), getCellYCoordinate(cell), getTurn()) });
            });
        }
    }
    const updateBoard = (x, y, value) => {
        if (gameBoardArray[y - 1][x - 1]) {
            return;
        }
        gameBoardArray[y - 1][x - 1] = value;
        let cellToChange = document.querySelector(`.column-${x}.row-${y}`);
        cellToChange.textContent = value;
        checkGameEnd(x, y, gameBoardArray);
        xTurn = !xTurn;
        if (compSide === getTurn() && document.querySelector(".winner-declaration").textContent === "") { controlComputer() };
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
        boardCells.forEach(cell => replaceCell(cell, true));
        addReplayButton();
    }
    const replaceCell = (cell, keepText) => {
        const newCell = cell.cloneNode(keepText);
        cell.parentNode.replaceChild(newCell, cell);
    }
    const addReplayButton = () => {
        const board = document.querySelector(".gameboard");
        const replayButton = document.createElement("button");
        replayButton.textContent = "Replay";
        replayButton.setAttribute("type", "button");
        replayButton.classList.add("replay-button");
        replayButton.addEventListener("click", function () { makeNewGame(document.querySelector(".player-select").value === "two-player") });
        board.appendChild(replayButton);
    }
    const setComputerInfo = () => {
        playerSide = document.querySelector(".disabled").textContent;
        compSide = playerSide === "X" ? "O" : "X";
        difficulty = document.querySelector(".difficulty-select").value;
    }
    const controlComputer = () => {
        let boardCells = document.querySelectorAll(".cell");
        boardCells.forEach(cell => replaceCell(cell, true));
        switch (difficulty) {
            case "easy":
                aiController.easyAI();
        }
        boardCells = document.querySelectorAll(".cell");
        setTimeout(function () {
            boardCells.forEach(cell => {
                cell.addEventListener("click", function () { updateBoard(getCellXCoordinate(cell), getCellYCoordinate(cell), getTurn()) });
            })
        }, 1000);
    }
    return { makeNewGame, setComputerInfo, controlComputer, updateBoard };
})();
const gameSettings = (() => {
    const setPlayerSelect = () => {
        const playerSelect = document.querySelector(".player-select");
        playerSelect.addEventListener("change", function () {
            toggleDifficultySelect(playerSelect);
            if (playerSelect.value === "two-player") {
                gameBoard.makeNewGame(true);
                playerSide = "";
                compSide = "";
                difficulty = "";
            }
            else {
                gameBoard.makeNewGame(false);
                document.querySelector(".start-button").addEventListener("click", function () {
                    gameBoard.makeNewGame(true);
                    document.querySelector(".start-button").disabled = true;
                    document.querySelector(".player-select").disabled = true;
                    document.querySelector(".difficulty-select").disabled = true;
                    document.querySelector(".x").disabled = true;
                    document.querySelector(".o").disabled = true;
                    gameBoard.setComputerInfo();
                    if (compSide === "X") { gameBoard.controlComputer() };
                });
            }
        });
    }
    const toggleDifficultySelect = (playerSelect) => {
        if (playerSelect.value === "computer") {
            const gameBoard = document.querySelector(".gameboard");
            const playerSelect = document.querySelector(".player-select");
            const playerSelectArea = document.querySelector(".player-select-area");
            const sideSelectArea = document.querySelector(".side-select-area");
            let difficultySelect = document.createElement("select");
            difficultySelect.classList.add("difficulty-select");
            let easyOption = document.createElement("option");
            let hardOption = document.createElement("option");
            let xOption = document.createElement("button");
            let oOption = document.createElement("button");
            let startButton = document.createElement("button");
            easyOption.setAttribute("value", "easy");
            hardOption.setAttribute("value", "hard");
            easyOption.textContent = "Easy";
            hardOption.textContent = "Hard";
            xOption.classList.add("x", "side-select-button", "disabled");
            oOption.classList.add("o", "side-select-button");
            xOption.textContent = "X";
            oOption.textContent = "O";
            xOption.addEventListener("click", toggleSide);
            oOption.addEventListener("click", toggleSide);
            startButton.setAttribute("type", "button");
            startButton.classList.add("start-button");
            startButton.textContent = "Start Game";
            difficultySelect.append(easyOption, hardOption);
            playerSelectArea.appendChild(difficultySelect);
            sideSelectArea.append(xOption, oOption);
            gameBoard.appendChild(startButton);
        }
        else {
            const difficultySelect = document.querySelector(".difficulty-select");
            const xOption = document.querySelector(".x");
            const oOption = document.querySelector(".o");
            const startButton = document.querySelector(".start-button");
            difficultySelect.parentElement.removeChild(difficultySelect);
            xOption.parentElement.removeChild(xOption);
            oOption.parentElement.removeChild(oOption);
            startButton.parentElement.removeChild(startButton);
        }
    }
    const toggleSide = () => {
        sideSelectButtons = document.querySelectorAll(".side-select-button");
        sideSelectButtons.forEach(sideSelectButton => {
            sideSelectButton.classList.toggle("disabled");
        });
    }
    return { setPlayerSelect, toggleSide };
})();
const aiController = (()=>{
    const evaluateEnd = () =>{
        // check for vertical wins  
        if (gameBoardArray[(y - 1) % 3][x - 1] === gameBoardArray[y % 3][x - 1] && gameBoardArray[y % 3][x - 1] === gameBoardArray[(y + 1) % 3][x - 1]) {
            return compSide === gameBoardArray[y % 3][x - 1] ? 10 : -10;
        }
        // check for horizontal wins
        else if ((gameBoardArray[y - 1][(x - 1) % 3] === gameBoardArray[y - 1][x % 3] && gameBoardArray[y - 1][x % 3] === gameBoardArray[y - 1][(x + 1) % 3])) {
            return compSide === gameBoardArray[y - 1][(x - 1) % 3] ? 10 : -10;
        }
        // check for diagonal wins
        else if ((x + y) % 2 === 0) {
            if (x === y && ((gameBoardArray[(y - 1) % 3][(x - 1) % 3] === gameBoardArray[y % 3][x % 3] && gameBoardArray[y % 3][x % 3] === gameBoardArray[(y + 1) % 3][(x + 1) % 3]))) {
                return compSide === gameBoardArray[(y - 1) % 3][(x - 1) % 3] ? 10 : -10;
            }
            else if (x !== y || x === 2) {
                if (gameBoardArray[2][0] === gameBoardArray[1][1] && gameBoardArray[1][1] === gameBoardArray[0][2]) {
                    return compSide === gameBoardArray[2][0] === gameBoardArray[1][1] ? 10 : -10;
                }
            }
        }
        return 0;
    }
    const isMovesLeft = ()=>{
        for(let i = 0; i<3; i++){
            for(let j = 0; j<3; j++){
                if (!(gameBoardArray[i][j])){
                    return true;
                }
            }
        }
        return false;
    }
    const easyAI = () => {
        const value = compSide;
        while (true) {
            xCoord = Math.floor(Math.random() * 3) + 1;
            yCoord = Math.floor(Math.random() * 3) + 1;
            if (gameBoardArray[yCoord - 1][xCoord - 1]){continue};
            setTimeout(function () { gameBoard.updateBoard(xCoord, yCoord, value) }, 1000);
            return;

        }
    }
    return {easyAI};
})();
gameBoard.makeNewGame(true);
gameSettings.setPlayerSelect();