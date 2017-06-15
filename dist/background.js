chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request.msg);
    sendResponse({
      msg: "[background] get your msg"
    })
  }
);

function foo(){
  console.log("in method foo ~");
}
