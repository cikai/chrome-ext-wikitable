function sendMsg(msg, callback) {

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
      if(callback){
        callback(response);
      }
    });
  });
}


(function() {

  var button = document.querySelector("button");
  button.addEventListener("click", function() {
    sendMsg({
      type: "find_table"
    }, function(response){
      // console.log(response);
    })
  })

})();
