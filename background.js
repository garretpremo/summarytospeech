var listenerCreated = false;

//context menu config
chrome.contextMenus.create( {
  title: "Summarize and say",
  contexts: ["selection"],
  onclick: sendTextToPopup
});

function sendTextToPopup(info, tab) {
  var popupData = {
    url: chrome.extension.getURL("popup.html"),
    width: 360,
    height: 365,
    type: 'popup'
  };

  if(window.navigator.userAgent.includes("Linux")) {
    popupData.width = 370;
    popupData.height= 330;
  }

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
