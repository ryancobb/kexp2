var audio = new Audio('');

chrome.extension.onMessage.addListener( function(request, sender, sendResponse)
{
  if (request.msg == "playing?") {
    sendResponse({msg: !audio.paused});
  }

  else if (request.msg == "pause")
  {
    audio.pause();
    audio = new Audio('');
  }
  else if (request.msg == "play")
  {
    audio = new Audio('http://50.31.180.202/');
    audio.play();
  }
})
