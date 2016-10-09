var listenerCreated = false;

//context menu config
chrome.contextMenus.create( {
  title: "Summarize and say",
  contexts: ["selection"],
  onclick: sendTextToPopup
});

function sendTextToPopup(info, tab) {
  //open popup
  window.open("popup.html", "SummarizeAndSay", "width=360,height=290,status=no,scrollbars=no,resizable=no");
  //send selectionText to popup when requested
  chrome.runtime.onMessage.addListener(function listener(reqest, sender, sendResponse) {
    //chrome.tabs.getCurrent(function(tab){ console.log(tab.id); })
    if (reqest.msg == 'selectionText') {
      //alert(info.selectionText);
      sendResponse(info.selectionText);
    }
    chrome.runtime.onMessage.removeListener(listener);
  });

}
