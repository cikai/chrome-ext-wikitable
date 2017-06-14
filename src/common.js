function getDefaultNode(){
  return {
    mode: 'text',
    type: 'TD',
    colspan: 1,
    rowspan: 1,
    value: 'xxx'
  }
}

function dealRow(row, setCol){
  var colCount = setCol - row.length;
  if(colCount == 0) {
    return row;
  }

  if(colCount > 0) {
    // add col
    var appendArr = Array.apply(null, {length: colCount}).map(() => getDefaultNode());
    row.splice(row.length, 0, ...appendArr);
  }

  if(colCount < 0){
    // delete col
    row.splice(colCount);
  }
}

export default {
  adjustArrSize(arr, row, col){
    if(!arr || !arr[0]) {
      arr = [[]];
    }
    var nowRow = arr.length;

    var rowCount = row - nowRow;

    // 调整row
    if(rowCount > 0){
      var appendArr = Array.apply(null, {length: rowCount}).map(() => []);
      arr.splice(arr.length, 0, ...appendArr);
    }
    if(rowCount < 0){
      arr.splice(rowCount);
    }

    // 调整col
    arr.forEach((row) => {
      dealRow(row, col);
    });

  }
}

