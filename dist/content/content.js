// content page, 可以当前打开tab的DOM等

function findTable(){
  var tables = document.querySelectorAll("table");
  tables = [...tables];
  tables = tables.filter((t) => {
    if(t.classList.length == 0){
      return true;
    }
  });

  if(tables.length == 0){
    clearTableClass();
  }

  if(tables[0]){
    tables[0].classList.add("wiki_find");
  }

  return tables[0];
}

function clearTableClass(){
  var tables = document.querySelectorAll("table");
  tables = [...tables];
  tables = tables.forEach((t) => {
    t.classList.remove("wiki_find");
  });
}

(function() {
  // 接收来自插件的消息

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      var type = request.type;
      if(type == 'find_table'){
        var table = findTable();

        if(!table){
          return;
        }

        table.scrollIntoView();
        sendResponse(table.innerHTML);

      }

    }
  );

})()
