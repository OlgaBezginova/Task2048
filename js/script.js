/*function randomNumber(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}*/

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