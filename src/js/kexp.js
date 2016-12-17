$( document ).ready(function() {

  $('.albumart').attr('src', '/assets/images/ring.svg')
  $('.material-icons').hide().fadeIn(1000);

  getSong();
  check_icon_state();

  setInterval(getSong, 5000);

  $("#button").on("click",function(){
   aud_play_pause();
  });
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
            defaultImage = "/assets/images/turntable.gif";
		    } else {
		        if (data.Artist) {
		            $('.artist em').hide();
		            artistName = data.Artist;
		            artistLink = '<a target="_new" href="http://www.google.com#q=' + encodeURI(artistName) + '">' + artistName + '</a>';
		            defaultImage = "/assets/images/turntable.gif";
		        }
		    }

		    dTime.html(data.TimePlayed);
		    dAlbumArt.attr('src', (data.AlbumArt) ? data.AlbumArt : defaultImage).fadeIn(750);
		    dArtist.html(artistLink).fadeIn(750);
		    dTrack.html((data.SongTitle) ? data.SongTitle : '').fadeIn(750);
		    dAlbum.html((data.Album) ? data.Album : '').fadeIn(750);
		},
		error: function(xhr, textStatus, errorThrown) {
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
