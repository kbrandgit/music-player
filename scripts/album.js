var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>'
   ;

   var handleSongClick = function () {
   var clickedSongNumber = $(this).attr('data-song-number');
     
     if (currentlyPlayingSongNumber == clickedSongNumber) { //pause or unpause
        if (currentSoundFile.isPaused()) { //song is paused, so play it and lock in play button
          currentSoundFile.play();
          $(this).html(pauseButtonTemplate);
        } else { //song is playing, pause it and lock in play button
          currentSoundFile.pause();
          $(this).html(playButtonTemplate);
        }
      } else { //no song played yet or different song played than current one
        if (currentSoundFile) { //if song is playing, stop it since we clicked on another.
          currentSoundFile.stop(); 
          $('.song-item-number[data-song-number="'+currentlyPlayingSongNumber+'"]').html(currentlyPlayingSongNumber);
        }
        currentlyPlayingSongNumber = clickedSongNumber; 
        setSong(songNumber);
        currentSoundFile.play(clickedSongNumber);
        $(this).html(pauseButtonTemplate);
   }

  };

  var onHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');

    // if the song being hovered over isn't the one being played
    if (songNumber !== currentlyPlayingSongNumber) {
      // show the play button
      songItem.html(playButtonTemplate);
    }
  };

  var offHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');
    // if the song being hovered over isn't the one being played
    if (songNumber !== currentlyPlayingSongNumber){
      // revert back to just showing the song number
      songItem.html(songNumber);
    }
  }

  var $row = $(template);

  $row.find('.song-item-number').click(handleSongClick);
  $row.hover(onHover, offHover);

  return $row;
};


var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
  $('.artist-name').html('<h3 class="artist-name">'+ album.artist +'</h3>')
 
};

var setSong = function (songNumber) {
  currentSoundFile = new buzz.sound(albums[1].songs[songNumber-1].audioUrl, {
    formats: [ 'mp3' ],
    preload: true,
  });
  $('.song-name').text(albums[1].songs[songNumber-1].title);
};

var currentSoundFile = null;
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSongNumber = null;
var currentAlbum = null

$('document').ready(function () {
  setCurrentAlbum(albums[1]);
});

