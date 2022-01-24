function toggleShowHide(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  var playerId = sessionStorage.getItem("user");

  if (connected && playerId == 'control-screen') { //TODO: To delete later
    $("#quizSection").show();
    $("#choosePlayerScreen").hide();
  } else if (connected) {
    $("#welcomeScreen").show();
    $("#welcomePlayerName").text(playerId)
    $("#choosePlayerScreen").hide();
  } else {
    $("#choosePlayerScreen").show();
    $("#quizSection").hide();
    showRound();
    $("#welcomeScreen").hide();
  }
}

$(document).ready(function () {
  console.log("Starting")
  toggleShowHide(false);
  $("form").on('submit', function (e) {
    e.preventDefault();
  });
  $("#connect").click(function () {
    connect();
  });

  $("#disconnect").click(function () {
    disconnect();
  });

});

