var choosePlayer = '';

function toggleShowHide(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  connected ? ScreenUtil.showWelcomeScreen() : ScreenUtil.showChoosePlayerScreen();
}

$(document).ready(function () {
  toggleShowHide(false);
  let chosenPlayer = '';
  if (choosePlayer === '') {
    choosePlayer = "player1";
    $("#" + choosePlayer + "-selected").attr("src", "../../image/choose_icon.png")
  }

  $('#player1-btn, #player2-btn, #player3-btn').click(function () {
    chosenPlayer = choosePlayer + "-selected";
    $("#" + chosenPlayer).removeAttr('src');
    choosePlayer = this.id.toString().replaceAll('-btn', '')
    $("#" + choosePlayer + "-selected").attr("src", "../../image/choose_icon.png")
  });

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

