const playerId = sessionStorage.getItem("user");

function toggleShowHide(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);

  if (connected && playerId == 'control-screen') { //TODO: To delete later
    $("#quizSection").show();
    $("#choosePlayerScreen").hide();
  } else if (connected) {
    ScreenUtil.showWelcomeScreen();
  } else {
    ScreenUtil.showChoosePlayerScreen();
  }
}

$(document).ready(function () {
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
  $("#send").click(function () {
    if (document.querySelector('input[name="players"]:checked').value == 'all') {
      sendAllPlayer();
      toggleShowHide(true)
    } else {
      sendSpecificPlayer();
      toggleShowHide(true)
    }
  });
});

