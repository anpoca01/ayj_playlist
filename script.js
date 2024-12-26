<!--names are 34 - 49 artists are 52 - 67 music urls are at 71 - 93  -->
$(function () {
  var playerTrack = $("#player-track"),
    bgArtwork = $("#bg-artwork"),
    bgArtworkUrl,
    albumName = $("#album-name"),
    trackName = $("#track-name"),
    albumArt = $("#album-art"),
    sArea = $("#s-area"),
    seekBar = $("#seek-bar"),
    trackTime = $("#track-time"),
    insTime = $("#ins-time"),
    sHover = $("#s-hover"),
    playPauseButton = $("#play-pause-button"),
    i = playPauseButton.find("i"),
    tProgress = $("#current-time"),
    tTime = $("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [ 
      "Killer w/Karina",
      "Ending Credit",
      "Dreaming",
      "Nerdy Love w/Mimi",
      "You, Clouds, Rain",
      "This Wish",
      "Nobody Gets Me",
      "Tangled Up In Me",
      "Born This Way w/lyj",
      "A Thousand Miles",
      "Ride",
      "Good Things",
      "I LOVE YOU 3000",
      "Event Horizon",
      "Nappa",
      "Gravity w/Liz",
      "Issues"
    ],
    trackNames = [ 
      "Valerie Broussard",
      "엄정화",
      "안유진",
      "pH-1",
      "헤이즈",
      "안유진",
      "SZA",
      "Skye Sweetnam",
      "Lady Gaga",
      "Vanessa Carlton",
      "쏠",
      "pH-1",
      "Stephanie Poetri",
      "윤하",
      "Crush",
      "태연",
      "Julia Michaels"
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5","_6","_7","_8","_9","_10","_11","_12","_13","_14","_15","_16","_17"],
    trackUrl = [
      "https://od.lk/s/MjdfNTk3MTYyOThf/Killer%20%28with%20Karina%29.wav",
      "https://od.lk/s/MjdfNTk3MTYzMTZf/Ending%20Credit.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMTVf/Dreaming.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMDJf/Nerdy%20Love%20%28with%20MIMI%29.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMTNf/You%2C%20Clouds%2C%20Rain.wav",
      "https://od.lk/s/MjdfNTk3MTYzMzFf/This%20Wish.wav",
      "https://od.lk/s/MjdfNTk3MTYzMDZf/Nobody%20gets%20me%20Covered%20by%20IVE%20ANYUJIN.wav",
      "https://od.lk/s/MjdfNTk3MTYzMDlf/Tangled%20Up%20In%20Me.wav",
      "https://od.lk/s/MjdfNTk3MTYzMjZf/Born%20This%20Way%20%28Youngji%29.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMTRf/A%20Thousand%20Miles.WAV",
      "https://od.lk/s/MjdfNTk3MTc0MzBf/ride.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMjJf/Good%20Things.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMjVf/I%20LOVE%20YOU%203000.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMjFf/Event%20Horizon.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMDFf/Nappa.WAV",
      "https://od.lk/s/MjdfNTk3MTYzMjRf/Gravity%20%28with%20Liz%29.WAV",
      "https://od.lk/s/MjdfNTk3MTYyOTZf/Issues.WAV"
    ],
    playPreviousTrackButton = $("#play-previous"),
    playNextTrackButton = $("#play-next"),
    currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 0 || ctSeconds < 0) return;

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.text("--:--");
    else insTime.text(ctMinutes + ":" + ctSeconds);

    insTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    insTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    nTime = new Date();
    nTime = nTime.getTime();

    if (!tFlag) {
      tFlag = true;
      trackTime.addClass("active");
    }

    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.text("00:00");
    else tProgress.text(curMinutes + ":" + curSeconds);

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.text("00:00");
    else tTime.text(durMinutes + ":" + durSeconds);

    if (
      isNaN(curMinutes) ||
      isNaN(curSeconds) ||
      isNaN(durMinutes) ||
      isNaN(durSeconds)
    )
      trackTime.removeClass("active");
    else trackTime.addClass("active");

    seekBar.width(playProgress + "%");

    if (playProgress == 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering").removeClass("active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime == 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date();
      bTime = bTime.getTime();
    }, 100);
  }

  function selectTrack(flag) {
    // Update currIndex based on the flag (1 for next, -1 for previous)
    if (flag === 0 || flag === 1) {
      currIndex++;
    } else {
      currIndex--;
    }
  
    // Ensure currIndex is within bounds of the albums array
    if (currIndex < 0) {
      currIndex = albums.length - 1; // Loop back to the last track if currIndex is negative
    } else if (currIndex >= albums.length) {
      currIndex = 0; // Loop back to the first track if currIndex exceeds the length
    }
  
    // Set current track details
    currAlbum = albums[currIndex];
    currTrackName = trackNames[currIndex];
    currArtwork = albumArtworks[currIndex];
  
    // Set audio source to the selected track
    audio.src = trackUrl[currIndex];
  
    // Reset progress bar and track time
    seekBar.width(0);
    trackTime.removeClass("active");
    tProgress.text("00:00");
    tTime.text("00:00");
  
    // Initialize time variables
    nTime = 0;
    bTime = new Date();
    bTime = bTime.getTime();
  
    // Update album and track info on the UI
    albumName.text(currAlbum);
    trackName.text(currTrackName);
    albumArt.find("img.active").removeClass("active");
    $("#" + currArtwork).addClass("active");
  
    // Update background artwork
    bgArtworkUrl = $("#" + currArtwork).attr("src");
    bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
  
    // Start playback if flag is not 0 (i.e., if not paused)
    if (flag !== 0) {
      audio.play();
      playerTrack.addClass("active");
      albumArt.addClass("active");
  
      clearInterval(buffInterval);
      checkBuffering();
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on("click", playPause);

    sArea.mousemove(function (event) {
      showHover(event);
    });

    sArea.mouseout(hideHover);

    sArea.on("click", playFromClickedPos);

    $(audio).on("timeupdate", updateCurrTime);

    $(audio).on("ended", function() {
      // Check if we are at the last track
      if (currIndex === albums.length - 1) {
        currIndex = 0; // Loop back to the first track
      } else {
        selectTrack(1); // Move to the next track
      }
    
      // Ensure the track starts playing automatically
      audio.play();
    });

    playPreviousTrackButton.on("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });
  }

  initPlayer();
});