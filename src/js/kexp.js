var domElements = {};

$( document ).ready(function() {
  domElements.time       = $('.time');
  domElements.artistname = $('.artistname');
  domElements.track      = $('.track');
  domElements.album      = $('.album');
  domElements.albumart   = $('.albumart');
  domElements.button     = $('#button');

  initialize(); 
  getSong();
  check_icon_state();
});

function initialize() {
  domElements.time.hide().fadeIn(750);
  domElements.artistname.hide().fadeIn(750);
  domElements.track.hide().fadeIn(750);
  domElements.album.hide().fadeIn(750);
  domElements.albumart.attr('src', '/assets/images/ring.svg').hide().fadeIn(750);
  domElements.button.hide().fadeIn(750);


  startSiriWave();
  bindEvents();
  setInterval(getSong, 5000);
}

function bindEvents() {
  domElements.button.on("click",function(){
    aud_play_pause();
  });
}

function startSiriWave() {
  var siriWave = new SiriWave({
    container: document.getElementById('album-art-container'),
    width: 500,
    height: 450,

    speed: 0.025,
    color: '#000',
    frequency: 2

  });

  siriWave.start();

  // Somewhat hacky, have to handle hiding and initialization here because the canvas
  // element doesn't exist yet.
  domElements.canvas = $('canvas');
  domElements.canvas.hide();
}

var getSong = function () {
	$.ajax({
		type: "GET",
    crossDomain: true,
		url: "http://128.208.196.80/play/?limit=1",
		success: function (data) {
      var stationData = buildStationData(data);
      stationData.playtype == 4 ? setAirbreak(stationData) : setArtistData(stationData);
		},
		error: function(xhr, textStatus, errorThrown) {
      handleError();
		}
	});
};

function buildStationData(data) {
  var result = data.results[0];

  // --- Mock for DJ break data --- 
  // result.artist = null;
  // result.release = null;
  // result.track = null;
  // result.playtype.playtypeid = 4;

  // --- Mock for no album art ---
   // result.artist.name = "Dobby";
   // result.release.name = "Is a Free Elf";
   // result.release.largeimageuri = null;
   // result.track.name = "Thanks for the sock";
   // result.playtype.playtypeid = 1;

  var stationData = {
    time:       safeString(result.airdate),
    artistname: result.artist   ? safeString(result.artist.name)           : "",
    track:      result.track    ? safeString(result.track.name)            : "",
    album:      result.release  ? safeString(result.release.name)          : "",
    albumart:   result.release  ? safeString(result.release.largeimageuri) : "",
    playtype:   result.playtype ? safeString(result.playtype.playtypeid)   : ""
  }
  return stationData;
}

function safeString(some_string) {
  return some_string ? some_string : "";
}

function setAirbreak (stationData) {
  domElements.canvas.show();
  domElements.albumart.hide();

  domElements.track.html('');
  domElements.time.html(moment(stationData.time).format('LT'));
  domElements.artistname.html('DJ Break...');
  domElements.track.html('');
  domElements.album.html('');
}

function setArtistData(stationData) {
  domElements.canvas.hide();
  domElements.albumart.show();

  var artistLink = '<a target="_new" href="http://www.google.com#q=' + encodeURI(stationData.artistname) + '">' + stationData.artistname + '</a>';

  domElements.albumart.attr('src', stationData.albumart ? stationData.albumart : noAlbumArt());
  domElements.time.html(moment(stationData.time).format('LT'));
  domElements.artistname.html(artistLink);
  domElements.track.html(stationData.track);
  domElements.album.html(stationData.album);
}

function noAlbumArt() {
  domElements.canvas.show();
  domElements.albumart.hide();

  return "";
}

function handleError() {
  domElements.canvas.hide();

  domElements.albumart.attr('src', '/assets/images/ring.svg');
  domElements.artistname.html('Oh no! KEXP may be experiencing issues');
  domElements.track.html("I'll keep trying...");
}

function aud_play_pause() {
  chrome.extension.sendMessage({msg: "playing?"},
    function(response) {
      if (response.msg == true) {
        chrome.extension.sendMessage({msg: "pause"});
        set_icon("play");
      }
      else if (response.msg == false) {
        chrome.extension.sendMessage({msg: "play"});
        set_icon("pause");
      }
    }
  );
}

function check_icon_state() {
  chrome.extension.sendMessage({msg: "playing?"},
    function(response) {
      if (response.msg == true) {
        set_icon("pause");
      }
      else if (response.msg == false) {
        set_icon("play");
      }
    }
  );
}

function set_icon(status) {
  switch (status) {
    case "play":
      $("#button").attr("src", "/assets/icons/play.svg");
      break;
    case "pause":
      $("#button").attr("src", "/assets/icons/pause.svg");
  }
}
