(function() {

  // 发送消息到content page（当前打开的画面）
  var btnContent = document.querySelector("#btn_content");
  btnContent.addEventListener("click", function(){
    sendMsg("content", "HELLO");
  })

  // 发送消息到background
  var btnBg = document.querySelector("#btn_background");
  btnBg.addEventListener("click", function(){
    sendMsg("background","Greeting !");
  })


  // 通过方法getBackgroundPage 直接取得background画面的window对象
  // 调用其中的方法
  var btnBg2 = document.querySelector("#btn_background2");
  btnBg2.addEventListener("click", function(){
    var backgroundPage = chrome.runtime.getBackgroundPage(function(bgWindow){
      bgWindow["foo"].call(null);
    });
  })


})();

function sendMsg(to, msg){

  if(to === 'background' || to === 'browser'){
    _sendMsgBg(msg);
  }else if(to === 'content'){
    _sendMsgContent(msg);
  }
}

function _sendMsgBg(msg){
  chrome.runtime.sendMessage({
    msg: msg
  }, function(response){
    if(response) {
      console.log("response", response);
    }
  });
}

function _sendMsgContent(msg) {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      msg:msg
    }, function(response) {
      if(response){
        console.log(response);
      }
    });
  });
}
