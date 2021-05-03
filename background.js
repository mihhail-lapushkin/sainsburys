chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('sainsburys.co.uk')) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: [ 'sainsburys.js' ],
    });
  }
});
