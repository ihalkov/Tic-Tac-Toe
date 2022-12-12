window.onload = function () {
     // everything goes here
    const container = document.querySelector('.container');
    createDivElements(container);

    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    
    // game control
    let board = [
        '', '', '', '', '', '', '', '', ''
    ];
    
    let currentPlayer = 'X'; // is default for beginning
    let isGameActive = true; // till win or tie

    // how many are on the board
    let countMoves = 0;
    let xWon = 0;
    let oWon = 0;
    let tie = 0;

    // addEventListener on the container
    container.addEventListener('click', onTileClick);

    function onTileClick(event) {
        event.preventDefault();

        // console.log(this);
        // protection from wrong event.target
        if (event.target.tagName == 'DIV') {
            const currTile = event.target;
            const tileIndex = currTile.id;

            if (isValidAction(currTile) && isGameActive) {
                // add value to the
                currTile.textContent = currentPlayer;
                currTile.classList.add(`player${currentPlayer}`);

                updateBoard(tileIndex, board, currentPlayer);

                countMoves += 1;

                if (countMoves >= 5) {
                    isGameActive = checkForWin(board, announcer, currentPlayer)
                }

                if (isGameActive) {
                    currentPlayer = changePlayer(playerDisplay, currentPlayer);
                }
            }

        }

    }

    resetButton.addEventListener('click', onReset);

    function onReset() {
        announcer.textContent = '';
        currentPlayer = 'X';
        isGameActive = true;

        board = [
            '', '', '', '', '', '', '', '', ''
        ];


       tiles.forEach(el => {
            el.textContent = '';
            el.classList.remove('playerX');
            el.classList.remove('playerO');
            el.classList.remove('tie');
        });

        announcer.textContent = '';
        announcer.classList.remove('playerX');
        announcer.classList.remove('playerO');
        announcer.classList.remove('tie');

        playerDisplay.textContent = 'X';
        playerDisplay.classList.remove('playerO');
        playerDisplay.classList.add('playerX');
    }

    function checkForWin(board, announcer, currentPlayer) {
        let isWin = false;
        let winningPlayer = '';
    
    
        // end states to avoid typos
        const endStates = {
            'x': 'Player X Won',
            'o': 'Player O Won',
            'tie': 'Tie'
        };
    
        const winningConditions = [
            [0, 1, 2],
            [0, 3, 6],
            [0, 4, 8],
            [1, 4, 7],
            [2, 4, 6],
            [2, 5, 8],
            [3, 4, 5],
            [6, 7, 8],
        ];
            
        for (let r = 0; r < winningConditions.length; r++) {
            let currRow = winningConditions[r]; // is arr
            let prevInd = currRow[0]; // is initialized the 1st value of the arr
            let prevVal = board[prevInd];
    
            if (prevVal == '') {
                continue;
            }
    
            let same = 1;
            
            for (let c = 1; c < currRow.length; c++) {
                let currInd = currRow[c];
                let currVal = board[currInd];
    
                if (currVal != prevVal) {
                    break;
                }
    
                same += 1;
            }
    
            if (same === 3) {
                // there is win
                isWin = true;
                winningPlayer = prevVal;
                if (winningPlayer == 'X') {
                    xWon += 1;
                } else {
                    oWon += 1;
                }
                break;
            }
            
        }
    
        if (isWin) {
            let key = winningPlayer.toLowerCase();
            let winner = document.getElementById(`${key}Won`);
            
            if (key == 'x') {
                winner.textContent = `X = ${xWon}`;
            } else {
                winner.textContent = `O = ${oWon}`;
            }

            return false;
        } else if (!board.includes('')) {
            tie += 1;
            document.getElementById('tie').textContent = `TIE = ${tie}`;
            return false;
        } else {
            return true;
        }
    
    }
}

function createDivElements(container) {
    for (let i = 0; i < 9; i++) {
        const currDiv = document.createElement('div');
        currDiv.className = 'tile';
        currDiv.id = i;
        container.appendChild(currDiv);
    }
}

// if there is already something return false
const isValidAction = (tile) => {
    if (tile.innerText === 'X' || tile.innerText === 'O') {
        return false;
    }
    return true;
}

// ti the array attach current player X or O
// later will check for equality
function updateBoard(index, board, currentPlayer) {
    board[index] = currentPlayer;
}

// remove the playerX or O class from span
function changePlayer(playerDisplay, currentPlayer) {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    playerDisplay.innerText = currentPlayer;
    playerDisplay.classList.add(`player${currentPlayer}`);
    return currentPlayer;
}

function announce(announcer, endResult, currentPlayer) {
    // announcer.textContent = `${endResult}`;
    // announcer.classList.remove('hide');

    if (endResult == 'Tie') {
        announcer.classList.add('tie');
    } else {
        announcer.classList.add(`player${currentPlayer}`);
    }
}

