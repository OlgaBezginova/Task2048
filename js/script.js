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

for(let i = 0; i < tableSize; i++){
  let newTr = tr.cloneNode(true);
  for(let j = 0; j < tableSize; j++){
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

intro.appendChild(description);






wrapper.appendChild(title);
wrapper.appendChild(intro);
table.appendChild(tbody);
wrapper.appendChild(table);

document.body.appendChild(wrapper);
wrapper.style.width = getComputedStyle(table).width;


//Create number 2 or 4 in a random cell
function newNumber(){    
    const emptyCells = document.querySelectorAll('.empty');
    const randCell = emptyCells[randomNumber(0, emptyCells.length-1)];
    randCell.textContent = randomNumber(1,2)*2;
    if(randCell.textContent === '2'){
        randCell.className = 'num2';
    }else{
        randCell.className = 'num4';
    }
    return randCell;
}

//Initialize table for new game
function initTable(){
    for (var i = 0; i < tableSize; i++) {
        for (var j = 0; j < tableSize; j++) {
            table.rows[i].cells[j].className = 'empty';
            table.rows[i].cells[j].textContent = '';            
        }
    }
    let twoUniqueCells = false;
    while(!twoUniqueCells){ 
        const initNumber0 = newNumber();
        const initNumber1 = newNumber();
        if(initNumber0 !== initNumber1){
            twoUniqueCells = true;   
        }        
    } 
}

initTable();

