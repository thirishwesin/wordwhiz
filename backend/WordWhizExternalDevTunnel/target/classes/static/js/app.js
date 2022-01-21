var playerId = null;

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  playerId = sessionStorage.getItem("user");
  if (connected && playerId == 'control-screen') {
    $("#quizSection").show();
    $("#choosePlayerScreen").hide();
  } else if (connected) {
    if (playerId != '') {
      $("#round4Screen").show();
    }
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

function sendSpecificPlayer() {
  console.log(stompClient)
  stompClient.send("/control-screen/show/question/to/specific-player", {}, JSON.stringify({
    'question': $("#question").val(),
    'toPlayer': document.querySelector('input[name="players"]:checked').value
  }));
}

function sendAllPlayer() {
  stompClient.send("/control-screen/show/question/to/all-player", {}, JSON.stringify({
    'question': $("#question").val(),
    'toPlayer': document.querySelector('input[name="players"]:checked').value
  }));
}

function showQuestion(question) {
  $("#questions").append("<li>" + question + "</li>");
}

function showAnswer(answer, sendFrom) {
  $("#answers").append("<li>" + answer + "  (" + sendFrom + ")</li>");
}

function submitAnswer() {
  stompClient.send("/app-screen/submit/answer", {}, JSON.stringify({
    'answer': $("#answer").val(),
    'sendFrom': '',
    'sendTo': 'control-screen'
  }));
}

function getStompClient(){
  return stompClient;
}

$(document).ready(function () {
  console.log("Starting")
  setConnected(false);
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
    } else {
      sendSpecificPlayer();
    }
  });
  $("#submit-answer-btn").click(function () {
    submitAnswer();
  });

});

