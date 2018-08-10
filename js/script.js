function randomNumber(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

const tableSize = 4;

let table = document.createElement('table');
let tbody = document.createElement('tbody');
let tr = document.createElement('tr');
let td = document.createElement('td');

for(let i = 0; i < tableSize; i++){
  let newTr = tr.cloneNode(true);
  for(let j = 0; j < tableSize; j++){
    let newTd = td.cloneNode(false);
    newTd.dataset.row = i + '';
    newTd.dataset.col = j + '';
    newTr.appendChild(newTd);
  }

  tbody.appendChild(newTr);
}

table.appendChild(tbody);
document.body.appendChild(table);

//Create number 2 or 4 in a random cell
function newNumber(){    
    let emptyCells = document.querySelectorAll('.empty');
    let randCell = emptyCells[randomNumber(0, emptyCells.length-1)];
    randCell.textContent = randomNumber(1,2)*2;
    randCell.classList.remove('empty');
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
        let initNumber0 = newNumber();
        let initNumber1 = newNumber();
        if(initNumber0 !== initNumber1){
            twoUniqueCells = true;   
        }        
    } 
}



