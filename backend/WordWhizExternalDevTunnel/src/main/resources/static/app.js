var stompClient = null;

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
    stompClient.connect({
            "user": document.getElementById("playerName").value
        }
        , function (frame) {
            setConnected(true);
            console.log('Connected: ' + frame);
            // come from control-screen
            stompClient.subscribe('/external-device/show/question/to/specific-player',
                function (question) {
                    showQuestion(JSON.parse(question.body).question);
                });
            stompClient.subscribe('/show/question/to/all-player',
                function (question) {
                    showQuestion(JSON.parse(question.body).question);
                });
            // come from app screen
            stompClient.subscribe('/external-device/submit/answer', function (answer) {
                console.log("/external-device/submit/answer")
                var ansewrObj = JSON.parse(answer.body);
                showAnswer(ansewrObj.answer, ansewrObj.sendFrom);
              });
        });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
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

function submitAnswer(){
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
        if (document.querySelector('input[name="players"]:checked').value == 'all'){
            sendAllPlayer();
        }else {
            sendSpecificPlayer();
        }
    });
  $("#submit-answer-btn").click(function () {
    submitAnswer();
  });

});
