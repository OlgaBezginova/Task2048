function randomNumber(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

const tableSize = 4;

const wrapper =  document.createElement('div');
wrapper.classList.add('wrapper');

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

const button = document.createElement('div');
button.classList.add('button');
button.textContent = 'New Game';
button.addEventListener('click', startNewGame);

//------------------------------------
intro.appendChild(description);
intro.appendChild(button);
wrapper.appendChild(title);
wrapper.appendChild(intro);
table.appendChild(tbody);
wrapper.appendChild(table);
document.body.appendChild(wrapper);
wrapper.style.width = getComputedStyle(table).width;

startNewGame();

//Create number 2 or 4 in a random cell
function newNumber(){    
    const emptyCells = document.querySelectorAll('.empty');
    const randCell = emptyCells[randomNumber(0, emptyCells.length-1)];
    randCell.textContent = randomNumber(1,2)*2;
    randCell.className = `num${randCell.textContent}`; 
    return randCell;
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
    const timeout = setTimeout(initTable, 300);

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

//Shift all numbers to one of the table edges 
function shiftToEnd(set) {
    let emptyCount = 0;
    for(let j = set.length - 1; j >= 0; j--) {
        if(set[j].className !== 'empty') {
            if(j === set.length - 1 || set[j + 1].className !== 'empty') { 
                continue;                
            }
            setNumber(set[j + emptyCount], set[j].textContent);
            clearCell(set[j]); 
        } else {
            emptyCount++;
        }        
    }
}

function shiftToStart(set) {
    let emptyCount = 0;
    for(let j = 0; j < set.length; j++) {
        if(set[j].className !== 'empty') {
            if(!j || set[j - 1].className !== 'empty') {
                continue;
            }    
            setNumber(set[j - emptyCount], set[j].textContent);
            clearCell(set[j]);
        }
        else {
            emptyCount++;
        }
    }
}

//Multiply same numbers
function joinNumbersToEnd(set) {
    for(let j = set.length - 2; j >= 0; j--) {
        if(set[j].className === 'empty') {
            break;
        }
        if(set[j].textContent === set[j + 1].textContent) {
            setNumber(set[j + 1], set[j].textContent*2);
            clearCell(set[j]);
        }        
    }
}

function joinNumbersToStart(set) {
    for(let j = 1; j < set.length; j++) {
        if(set[j].className === 'empty') {
            break;
        }
        if(set[j].textContent === set[j - 1].textContent) {
            setNumber(set[j - 1], set[j].textContent*2);
            clearCell(set[j]);
        }        
    }
}

function shiftDown() {    
    for(let i = 0; i < tableSize; i++) {   
        const column = document.querySelectorAll(`td[data-col="${i}"]`); 
        shiftToEnd(column);
        joinNumbersToEnd(column);
        shiftToEnd(column);
    } 
}

function shiftUp() {
    for(let i = 0; i < tableSize; i++) {
        const column = document.querySelectorAll(`td[data-col="${i}"]`); 
        shiftToStart(column);
        joinNumbersToStart(column);
        shiftToStart(column);
    }
}

function shiftLeft() {
    for(let i = 0; i < tableSize; i++) {
        const row = document.querySelectorAll(`td[data-row="${i}"]`); 
        shiftToStart(row);
        joinNumbersToStart(row);
        shiftToStart(row);
    }
}

function shiftRight() {
    for(let i = 0; i < tableSize; i++) {
        const row = document.querySelectorAll(`td[data-row="${i}"]`); 
        shiftToEnd(row);
        joinNumbersToEnd(row);
        shiftToEnd(row);
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
        const timeout = setTimeout(newNumber, 100); 
    }
});