// content page, 可以当前打开tab的DOM等

(function() {
  // 接收来自插件的消息

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");

      console.log(request.msg);

      sendResponse({
        msg: "[" + window.location.href + "] got your msg"
      })
    }
  );

})()
