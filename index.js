const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const field = [];
const dimension = 3;
let cellsCount = 0;
let counter = 0;
let winner = undefined;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();


function startGame() {
    fillEmptyField(dimension);
    renderGrid(dimension);
}

function fillEmptyField(dimension) {
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(EMPTY);
        }
        field.push(row);
    }
    cellsCount = field.length * field[0].length;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}


function checkWinner() {
    for (let i = 0; i < field.length; i++) {
        let firstEl = field[i][0];
        if (field[i].every(cell => cell === firstEl && cell !== EMPTY)) {
            for (let j = 0; j < field[i].length; j++) {
                renderSymbolInCell(firstEl, i, j, '#FF0000')
            }
            return firstEl;
        }
    }
    for (let i = 0; i < field.length; i++) {
        let firstEl = field[0][i];
        if (field.every(row => row[i] === firstEl && row[i] !== EMPTY)) {
            for (let j = 0; j < field[i].length; j++) {
                renderSymbolInCell(firstEl, j, i, '#FF0000')
            }
            return firstEl;
        }
    }
    let winnerCells = [];
    let firstEl = field[0][0];
    let completed = true;
    for (let i = 0; i < field.length; i++) {
        winnerCells.push(i);
        if (field[i][i] !== firstEl) {
            completed = false;
            winnerCells = []
            break;
        }
    }
    if (completed && firstEl !== EMPTY) {
        winnerCells.forEach(element => {
            renderSymbolInCell(firstEl, element, element, '#FF0000')
        });
        return firstEl;
    }
    firstEl = field[0][field.length - 1];
    completed = true;
    for (let i = 0; i < field.length; i++) {
        winnerCells.push(i);
        if (field[i][field.length - 1 - i] !== firstEl) {
            completed = false;
            winnerCells = []
            break;
        }
    }
    if (completed && firstEl !== EMPTY) {
        winnerCells.forEach(element => {
            renderSymbolInCell(firstEl, element, field.length - 1 - element, '#FF0000')
        });
        return firstEl;
    }
}

function cellClickHandler(row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (field[row][col] !== EMPTY || winner !== undefined) {
        return;
    }
    if (counter % 2) {
        field[row][col] = ZERO;
        renderSymbolInCell(ZERO, row, col);
    }
    else {
        field[row][col] = CROSS;
        renderSymbolInCell(CROSS, row, col);
    }
    winner = checkWinner()
    if (winner !== undefined) {
        console.log(winner)
        alert(`Победил: ${winner}`);
    }
    counter++;
    if (winner === undefined && counter !== cellsCount){
        aiMove();
    }
    if (counter === cellsCount) {
        alert('Победила дружба');
    } 
}

function aiMove() {
    const [row, col] = getRandomCoords();
    field[row][col] = ZERO;
    renderSymbolInCell(ZERO, row, col);

    winner = checkWinner();
    if (winner !== undefined) {
        console.log(winner);
        alert(`Победил: ${winner}`);
        return;
    }

    counter++;
    if (counter === cellsCount) {
        alert('Победила дружба');
    }
}

function getRandomCoords(){
    while (true) {
        let row = getRandomInt(0, dimension - 1);
        let col = getRandomInt(0, dimension - 1);
        if (field[row][col] === EMPTY){
            return [row, col];
        }
    }
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    console.log('reset!');
    counter = 0;
    winner = undefined;
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            field[i][j] = EMPTY;
            renderSymbolInCell(EMPTY, i, j);
        }

    }
}


/* Test Function */
/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}
