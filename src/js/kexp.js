$( document ).ready(function() {

  $('.artistname').html("Loading...");
  $('.track').hide();
  $('.album').hide();
  $('.albumart').hide();

  getSong();
  check_icon_state();

  setInterval(getSong, 5000);

  $("#playpause").on("click",function(){
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
		    dAlbumArt.attr('src', (data.AlbumArt) ? data.AlbumArt : defaultImage).fadeIn(500);
		    dArtist.html(artistLink).fadeIn(500);
		    dTrack.html((data.SongTitle) ? data.SongTitle : '').fadeIn(500);
		    dAlbum.html((data.Album) ? data.Album : '').fadeIn(1000);
		},
		error: function(xhr, textStatus, errorThrown) {
		    if (console) console.log("getSong() error:<br />" + xhr.responseText + "<br />" + errorThrown + "<br />" + textStatus);
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
      $("#button").html("play_circle_outline");
      break;
    case "pause":
      $("#button").html("pause_circle_outline");
  }
}
