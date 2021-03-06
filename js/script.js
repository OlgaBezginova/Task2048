const tableSize = 4;

//Containers
const wrapper =  document.createElement('div');
const gameContainer =  document.createElement('div');

//Table
const table = document.createElement('table');
const tbody = document.createElement('tbody');
const tr = document.createElement('tr');
const td = document.createElement('td');

//Heading elements
const title = document.createElement('h1');
const intro = document.createElement('div');
const description = document.createElement('div');
const newGameBtn = document.createElement('div');

//Messages
const message = document.createElement('div');
const messageTitle = document.createElement('h2');
const tryAgainBtn = document.createElement('div');
const keepGoingBtn = document.createElement('div');

createTable(); 

//Append elements
intro.appendChild(description);
intro.appendChild(newGameBtn);
table.appendChild(tbody);
message.appendChild(messageTitle);
message.appendChild(tryAgainBtn);
message.appendChild(keepGoingBtn);
gameContainer.appendChild(table);
gameContainer.appendChild(message);
wrapper.appendChild(title);
wrapper.appendChild(intro);
wrapper.appendChild(gameContainer);
document.body.appendChild(wrapper);

setStyles();

startNewGame();

function randomNumber(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function setStyles() {
    wrapper.classList.add('wrapper');
    wrapper.style.width = getComputedStyle(table).width;
    gameContainer.classList.add('game-container');
    title.textContent = '2048';
    intro.classList.add('intro');
    description.classList.add('description');
    description.innerHTML = 'Join the numbers and get to the <b>2048 tile!</b>';
    newGameBtn.classList.add('button');
    newGameBtn.textContent = 'New Game';
    message.classList.add('message');
    message.style.width = getComputedStyle(table).width;
    message.style.height = getComputedStyle(table).height;
    tryAgainBtn.classList.add('button');
    tryAgainBtn.textContent = 'Try Again';
    keepGoingBtn.classList.add('button');
    keepGoingBtn.textContent = 'Keep Going';  
}

function createTable() {
    for(let i = 0; i < tableSize; i++) {
        let newTr = tr.cloneNode(true);
        for(let j = 0; j < tableSize; j++) {
            const newTd = td.cloneNode(false);
            newTd.dataset.row = i + '';
            newTd.dataset.col = j + '';
            newTr.appendChild(newTd);
        }
        tbody.appendChild(newTr);
    }
}

//Initialize table for new game
function startNewGame() {
    clearTable();
    setTimeout(initTable, 300);
}

function clearTable(){
    for(let i = 0; i < tableSize; i++) {
        for(let j = 0; j < tableSize; j++) {
            table.rows[i].cells[j].className = 'empty';
            table.rows[i].cells[j].textContent = '';            
        }
    }
}

function initTable() {
    let twoUniqueCells = false;
    while (!twoUniqueCells) { 
        const initNumber0 = newNumber();
        const initNumber1 = newNumber();
        if (initNumber0 !== initNumber1) {
            twoUniqueCells = true;   
        }        
    } 
}

//Create number 2 or 4 in a random cell
function newNumber(){  
    const emptyCells = document.querySelectorAll('.empty');
    if(emptyCells.length){
        const randCell = emptyCells[randomNumber(0, emptyCells.length-1)];
        randCell.textContent = randomNumber(1,2) * 2;
        randCell.className = `num${randCell.textContent}`; 
        randCell.style.transform = 'scale(1.1)';
        return randCell;
    } 
}

function clearCell(td) {
    td.className = 'empty';
    td.textContent = '';
}

function setNumber(td, value) {
    td.textContent = value;
    if(value <= 2048) {
        td.className = `num${td.textContent}`;
    } else {
        td.className = 'great';
    }
}

//Main logic
function shiftNumber(set) {
    let emptyCount = 0;   
    clearJoined();
    for(var j = set.length - 1; j >= 0; j--) {
        if(set[j].className !== 'empty') {
            if(j === set.length - 1) { //Number is in the last sell
                continue;                
            }
            let nextNumber = findNextNumber(set[j], j);
            if(!nextNumber || nextNumber.className !== set[j].className) { //Number is the last in the set or next number is not the same                
                if(set[j + 1].className !== 'empty') { //Next cell is not empty
                    continue;
                }
                setNumber(set[j + emptyCount], set[j].textContent); //Shift number to the last empty cell
                clearCell(set[j]);                                 
            } else { 
                if(!nextNumber.classList.contains('joined')) {  //Numbers was not joined on previous iteration
                    setNumber(nextNumber, set[j].textContent * 2); //Join numbers
                    nextNumber.classList.add('joined');
                    clearCell(set[j]);
                    nextNumber.style.transform = 'scale(1.1)';
                    checkWin(nextNumber);
                    emptyCount++;
                } else {
                    setNumber(set[j + emptyCount], set[j].textContent); //Shift number to the last empty cell
                    clearCell(set[j]); 
                }
            }         
        } else {
            emptyCount++;
        }        
    }
    
    function findNextNumber(num, index) { //Finds next number in the set
        for(let i = index; i < set.length; i++) {
            if(set[i].className !== 'empty' && i !== index) {
                return set[i];
            }
        }
    }
    
    function clearJoined() {
        for(let i = 0; i < set.length; i++) {
            set[i].classList.remove('joined');
        }
    }
}

function shiftDown() {    
    for(let i = 0; i < tableSize; i++) {   
        const column = document.querySelectorAll(`td[data-col="${i}"]`); 
        shiftNumber(column);
    } 
}

function shiftUp() {
    for(let i = 0; i < tableSize; i++) {
        let column = document.querySelectorAll(`td[data-col="${i}"]`); 
        column = Array.prototype.slice.call(column).reverse();
        shiftNumber(column);
    }
}

function shiftLeft() {
    for(let i = 0; i < tableSize; i++) {
        let row = document.querySelectorAll(`td[data-row="${i}"]`);
        row = Array.prototype.slice.call(row).reverse();
        shiftNumber(row);
    }
}

function shiftRight() {
    for(let i = 0; i < tableSize; i++) {
        const row = document.querySelectorAll(`td[data-row="${i}"]`); 
        shiftNumber(row);
    } 
}

//Handling messages
function checkGameOver() {
    let currentCell, leftCell, lowerCell;
    for(let i = 0; i < tableSize; i++) {
        for(let j = 0; j < tableSize; j++) {
            currentCell = table.rows[i].cells[j].textContent;
            if(j < tableSize - 1) {
                leftCell = table.rows[i].cells[j + 1].textContent;
            } else {
                leftCell = '';
            }
            if(i < tableSize - 1) {
                lowerCell = table.rows[i + 1].cells[j].textContent;
            } else {
                lowerCell = '';
            }
            if(currentCell === leftCell || currentCell === lowerCell) {
                return;
            }
        }
    }
    message.className = 'message';
    message.classList.add('game-over');
    messageTitle.textContent = 'Game Over!';
    keepGoingBtn.style.display = 'none';
    message.classList.toggle('visible'); 
}

function checkWin(num) {
    if(num.textContent === '2048' && !message.classList.contains('you-win')) {
        message.classList.add('you-win');
        messageTitle.textContent = 'Ай маладэц!';
        keepGoingBtn.style.display = 'block';
        message.classList.toggle('visible');
    }
}

//Changes control
function tableChecksum(table) {
    const tdList = table.querySelectorAll('td');
    let checksum = 0;
    for(let i = 0; i < tdList.length; i++) {
        checksum += (i + 1) * tdList[i].textContent;
    }
    return checksum;
}


//Handling Events
newGameBtn.addEventListener('click', startNewGame);

table.addEventListener('transitionend', function(event) {
    if(event.target.tagName === 'TD') {
        event.target.style.transform = 'scale(1)';
    }
});

tryAgainBtn.addEventListener('click', function() {
    tryAgainBtn.parentElement.classList.toggle('visible');
    message.className = 'message';
    startNewGame(); 
});

keepGoingBtn.addEventListener('click', function() {
    keepGoingBtn.parentElement.classList.toggle('visible');
});

document.body.addEventListener('keydown', function(event) {  
    const chechsum = tableChecksum(table);
    switch(event.keyCode) {         
        case 37:  //Left
             shiftLeft();
             break;
        case 38:   //Up
             shiftUp();
             break;
        case 39:   //Right
             shiftRight();
             break;
        case 40:   //Down
             shiftDown();
             break;
    }
    const tableChanged = (chechsum !== tableChecksum(table));
    if(event.keyCode >= 37 && event.keyCode <= 40 && tableChanged) {
        setTimeout(function() {
            newNumber();
            if(!document.querySelectorAll('.empty').length) {
                checkGameOver();
            }
        }, 200);        
    }
});