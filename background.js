var listenerCreated = false;

//context menu config
chrome.contextMenus.create( {
  title: "Summarize and say",
  contexts: ["selection"],
  onclick: sendTextToPopup
});

// chrome.contextMenus.onClicked.addListener(function(info, tab)) {
//   sendTextToPopup(info, tab);
// }

function sendTextToPopup(info, tab) {
  //var mouseEvent = new MouseEvent('event');
  //open popup
  //window.open("popup.html", "SummarizeAndSay", "width=360,height=365,status=no,scrollbars=no,resizable=no");

  var popupData = {
    url: 'popup.html',
    width: 360,
    height: 365,
    type: 'popup'
  };

  if(window.navigator.userAgent.includes("Linux")) {
    popupData.width = 370;
    popupData.height= 330;
  }
  // if (event) {
  //   popupData.left = event.screenX;
  //   popupData.top = event.screenY;
  // }
  chrome.windows.create(popupData);
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
