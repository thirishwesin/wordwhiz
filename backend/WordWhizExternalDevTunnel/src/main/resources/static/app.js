var stompClient = null;
var onlineUsers = [];

function setConnected(connected) {
  $("#connect").prop("disabled", connected);
  $("#disconnect").prop("disabled", !connected);
  if (connected && document.getElementById("playerName").value == 'control-screen') {
    $("#quizSection").show();
  } else if (connected) {
    $("#conversation").show();
  } else {
    $("#quizSection").hide();
    $("#conversation").hide();
  }
  $("#questions").html("");
}

function connect() {
  var socket = new SockJS('/ws');
  stompClient = Stomp.over(socket);
  var playerName = document.getElementById("playerName").value;
  stompClient.connect({
      "username": playerName
    }
    , function (frame) {
      setConnected(true);
      console.log('Connected: ' + frame);
      subscribeForControlScreen(stompClient);
      subscribeForAppScreen(stompClient);
    });
}

function subscribeForControlScreen(stompClient){
  stompClient.subscribe('/external-device/submit/answer', function (answer) {
    var ansewrObj = JSON.parse(answer.body);
    showAnswer(ansewrObj.answer, ansewrObj.sendFrom);
  });
  stompClient.subscribe('/external-device/send/online-user', function (username) {
    onlineUsers.push(username.body)
    showActiveUser(onlineUsers);
  });
  stompClient.subscribe('/external-device/send/offline-user', function (username) {
    onlineUsers = onlineUsers.filter(value => value !== username.body)
    showActiveUser(onlineUsers);
  });
}

function subscribeForAppScreen(stompClient){
  stompClient.subscribe('/external-device/show/question/to/specific-player',
    function (question) {
      showQuestion(JSON.parse(question.body).question);
    });
  stompClient.subscribe('/show/question/to/all-player',
    function (question) {
      showQuestion(JSON.parse(question.body).question);
    });
}

function disconnect() {
  if (stompClient != null) {
    stompClient.disconnect(function (par){
      console.log(par)
    });
    console.log(stompClient)
  }
  setConnected(false);
  console.log("Disconnected");
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

function showActiveUser(onlineUsers){
  $("#online-users").text(onlineUsers);
}

function submitAnswer() {
  stompClient.send("/app-screen/submit/answer", {}, JSON.stringify({
    'answer': $("#answer").val(),
    'sendFrom': '',
    'sendTo': 'control-screen'
  }));
}

$(function () {
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
