function randomNumber(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

const tableSize = 4;

const wrapper =  document.createElement('div');
wrapper.classList.add('wrapper');
const gameContainer =  document.createElement('div');
gameContainer.classList.add('game-container');

//Create table
const table = document.createElement('table');
const tbody = document.createElement('tbody');
const tr = document.createElement('tr');
const td = document.createElement('td');

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

//Create heading elements
const title = document.createElement('h1');
title.textContent = '2048';

const intro = document.createElement('div');
intro.classList.add('intro');

const description = document.createElement('div');
description.classList.add('description');
description.innerHTML = 'Join the numbers and get to the <b>2048 tile!</b>';

const newGameBtn = document.createElement('div');
newGameBtn.classList.add('button');
newGameBtn.textContent = 'New Game';
newGameBtn.addEventListener('click', startNewGame);

//Create messages
const gameOver = document.createElement('div');
gameOver.classList.add('message', 'game-over');

const gameOverMsg = document.createElement('h2');
gameOverMsg.textContent = 'Game Over!';

const tryAgainBtn = document.createElement('div');
tryAgainBtn.classList.add('button');
tryAgainBtn.textContent = 'Try Again';

intro.appendChild(description);
intro.appendChild(newGameBtn);
wrapper.appendChild(title);
wrapper.appendChild(intro);
table.appendChild(tbody);
gameContainer.appendChild(table);
gameOver.appendChild(gameOverMsg);
gameOver.appendChild(tryAgainBtn);
gameContainer.appendChild(gameOver);
wrapper.appendChild(gameContainer);
document.body.appendChild(wrapper);

wrapper.style.width = getComputedStyle(table).width;
gameOver.style.width = getComputedStyle(table).width;
gameOver.style.height = getComputedStyle(table).height;

startNewGame();

//Create number 2 or 4 in a random cell
function newNumber(){  
    const emptyCells = document.querySelectorAll('.empty');
    if(emptyCells.length){
        const randCell = emptyCells[randomNumber(0, emptyCells.length-1)];
        randCell.textContent = randomNumber(1,2)*2;
        randCell.className = `num${randCell.textContent}`; 
        randCell.style.transform = 'scale(1.1)';
        return emptyCells;
    } 
}

//Initialize table for new game
function clearTable(){
    for(var i = 0; i < tableSize; i++) {
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

function startNewGame() {
    clearTable();
    setTimeout(initTable, 300);
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

function shiftNumber(set) {
    let emptyCount = 0;
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
                setNumber(nextNumber, set[j].textContent*2); //Join numbers
                clearCell(set[j]);
                nextNumber.style.transform = 'scale(1.1)';
                emptyCount++;
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

function tableChecksum(table) {
    const tdList = table.querySelectorAll('td');
    let checksum = 0;
    for(let i = 0; i < tdList.length; i++) {
        checksum += (i + 1) * tdList[i].textContent;
    }
    return checksum;
}

table.addEventListener('transitionend', function(event) {
    if(event.target.tagName === 'TD') {
        event.target.style.transform = 'scale(1)';
    }
});

tryAgainBtn.addEventListener('click', function() {
    tryAgainBtn.parentElement.classList.toggle('visible');
    startNewGame(); 
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
        setTimeout(newNumber, 200);
    }
});