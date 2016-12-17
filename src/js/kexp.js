$( document ).ready(function() {


  $('.time').hide().fadeIn(750);
  $('.artistname').hide().fadeIn(750);
  $('.track').hide().fadeIn(750);
  $('.album').hide().fadeIn(750);
  $('.album-art-container').attr('src', '/assets/images/ring.svg').hide().fadeIn(750);
  $('#button').hide().fadeIn(750);


  getSong();
  check_icon_state();

  setInterval(getSong, 5000);

  $("#button").on("click",function(){
   aud_play_pause();
  });

  var siriWave = new SiriWave({
      container: document.getElementById('album-art-container'),
      width: 500,
      height: 450,

      speed: 0.025,
      color: '#000',
      frequency: 2

  });

  siriWave.start();
  $("canvas").hide();
});

var getSong = function () {

    var base_url = "http://kexp.org"

    var dTime = $('.time');
    var dArtist = $('.artistname');
    var dTrack = $('.track');
    var dAlbum = $('.album');
    var dAlbumArt = $('.albumart');

	$.ajax({
		type: "GET",
    crossDomain: true,
		url: base_url + "/s/s.aspx",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		data: "x=3",
		success: function (data) {
		    var artistName, artistLink = "", defaultImage = "";

		    if (data.AirBreak) {
		        $('.artist em').show();
		        dArtist.html('');
            artistLink = 'DJ Break...';
            defaultImage = "";
		    } else {
		        if (data.Artist) {
		            $('.artist em').hide();
		            artistName = data.Artist;
		            artistLink = '<a target="_new" href="http://www.google.com#q=' + encodeURI(artistName) + '">' + artistName + '</a>';
		            defaultImage = "";
		        }
		    }

        data.AlbumArt ? $("canvas").hide() : $("canvas").show();

		    dTime.html(data.TimePlayed);
		    dAlbumArt.attr('src', (data.AlbumArt) ? data.AlbumArt : defaultImage);
		    dArtist.html(artistLink);
		    dTrack.html((data.SongTitle) ? data.SongTitle : '');
		    dAlbum.html((data.Album) ? data.Album : '');
		},
		error: function(xhr, textStatus, errorThrown) {
        $("canvas").hide();
        dAlbumArt.attr('src', "/assets/images/ring.svg");
        dArtist.html("Oh no! KEXP may be experiencing issues");
        dTrack.html("I'll keep trying...");
			}
	});
};

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
