window.addEventListener('DOMContentLoaded', () => {
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');

    const two = 2;
    const three = 3;
    const four = 4;
    const five = 5;
    const six = 6;
    const seven = 7;
    const eight = 8;
    const nine = 9;

    let board = ['', '', '', '', '', '', '', '', ''];
    let tiles = [];
    let currentPlayer = 'X';
    let isGameActive = true;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, two],
        [three, four, five],
        [six, seven, eight],
        [0, three, six],
        [1, four, seven],
        [two, five, eight],
        [0, four, eight],
        [two, four, six]
    ];

    function createBoard() {
        const board = document.querySelector('.container');

        for (let i = 0; i < nine; i++) {
            let box = document.createElement('div');
            box.classList.add('tile');

            board.appendChild(box);

            tiles = [...document.querySelectorAll('.tile')];
        }
    }

    createBoard();

    tiles.forEach((tile, index) => {
        const callback = () => userAction(tile, index)
        const customEvent = new CustomEvent('enter', callback);

        tile.addEventListener('keyup', (e) => {
            let btn = String(e.key);
            if (btn === 'Enter') {
                tile.dispatchEvent(customEvent);
            } else if (btn === 'ArrowRight' && index !== 0) {
                updateBoard(index);
            } else if (btn === 'ArrowLeft' && index !== eight) {
                updateBoard(index);
            }
        });

        tile.addEventListener('click', () => userAction(tile, index));
    });

    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i <= seven; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[two]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        if (!board.includes('')) {
            announce(TIE);
        }
    }

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
                break;
            default:
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }

        return true;
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');

        if (currentPlayer === 'O') {
            changePlayer();
        }

        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    }

    resetButton.addEventListener('click', resetBoard);

    // drag & drop
    const avatarIcons = document.querySelectorAll('.icons');
    const avatarContainer = document.querySelectorAll('.avatar-container');
    let avatarIcon;

    function moveAvatar(dataAttribute) {
        avatarIcon = document.querySelector(`[data-item="${dataAttribute}"]`)
    }

    avatarContainer.forEach(container => {
        container.addEventListener('dragover', dragover)
        container.addEventListener('drop', dragdrop)
    });

    avatarIcons.forEach(avatar => {
        avatar.addEventListener('dragstart', (event) => moveAvatar(event.target.getAttribute('data-item')));
    })

    function dragover(event) {
        event.preventDefault();
    }

    function dragdrop(event) {
        for (let elem of avatarContainer) {
            if (elem === event.target && !event.target.children.length) {
                event.target.appendChild(avatarIcon);
                removeEventListener('drop', dragdrop);
            }
        }
    }

});
