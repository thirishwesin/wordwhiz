function toggleShowHide(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);

  if (connected && SessionUtil.getValueFromSessionStorage("user") == 'control-screen') { //TODO: To delete later
    ScreenUtil.showQuizSection()
  }else {
    connected ? ScreenUtil.showWelcomeScreen() : ScreenUtil.showChoosePlayerScreen();
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

