var audio = new Audio('http://50.31.180.202/');

chrome.extension.onMessage.addListener( function(request, sender, sendResponse)
{
  if (request.msg == "playing?") {
    sendResponse({msg: !audio.paused});
  }

  else if (request.msg == "pause")
  {
    audio.pause();
  }
  else if (request.msg == "play")
  {
    audio.play();
  }
})
