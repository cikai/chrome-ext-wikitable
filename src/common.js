function clone(obj){
  return JSON.parse(JSON.stringify(obj));
}

function getDefaultNode(){
  return {
    mode: 'text',
    type: 'TD',
    colspan: 1,
    rowspan: 1,
    value: ''
  }
}

function padRow(arr, setRow){
  var currentRow = arr.length;
  var lastRow = arr[arr.length - 1];
  var count = setRow - currentRow;
  if(count == 0){
  }

  if(count > 0){
    // add row
    var appendRows = Array.apply(null, {length: count}).map(() => {
      return clone(lastRow);
    })
    arr = arr.splice(arr.length, 0 , ...appendRows);
  }

  if(count < 0){
    // delete rows
    arr.splice(count);
  }
}

function padCol(colArr, setCol){
  var currentColCount = colArr.reduce((sum,colItem) => {
    return sum + (colItem.colspan || 1);
  }, 0);
  var colCount = setCol - currentColCount;
  if(colCount == 0) {
    return colArr;
  }

  if(colCount > 0) {
    // add col
    var appendArr = Array.apply(null, {length: colCount}).map(() => getDefaultNode());
    colArr.splice(colArr.length, 0, ...appendArr);
  }

  if(colCount < 0){
    // delete col
    colArr.splice(colCount);
  }
}

export default {
  adjustArrSize(arr, row, col){
    if(!arr || !arr[0]) {
      arr = [[]];
    }

    padRow(arr, row);

    // 调整col
    arr.forEach(colArr => {
      padCol(colArr, col);
    });
  },

  sendMsg(msg, callback){
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
        if(callback){
          callback(response);
        }
      });
    });
  }
}

