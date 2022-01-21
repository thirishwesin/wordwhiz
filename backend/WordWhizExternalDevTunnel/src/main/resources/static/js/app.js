function toggleShowHide(connected, round) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  var playerId = sessionStorage.getItem("user");

  if (connected && playerId == 'control-screen') {
    $("#quizSection").show();
    $("#choosePlayerScreen").hide();
  } else if (connected) {
    $("#conversation").show();
    $("#choosePlayerScreen").hide();
  } else {
    $("#choosePlayerScreen").show();
    $("#quizSection").hide();
    $("#conversation").hide();
    $("#round2Screen").hide();
    $("#round4Screen").hide();
  }
  $("#questions").html("");
}

function showAnswer(answer, sendFrom) {
  $("#answers").append("<li>" + answer + "  (" + sendFrom + ")</li>");
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
  $("#send").click(function () {
    if (document.querySelector('input[name="players"]:checked').value == 'all') {
      sendAllPlayer();
      toggleShowHide(true, document.querySelector('input[name="rounds"]:checked').value)
    } else {
      sendSpecificPlayer();
      toggleShowHide(true, document.querySelector('input[name="rounds"]:checked').value)
    }
  });
  $("#submit-answer-btn").click(function () {
    submitAnswer();
  });

});

