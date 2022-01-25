var stompClient = null;

function connect() {
  var socket = new SockJS('/ws');

  stompClient = Stomp.over(socket);

  let userName = document.querySelector('input[name="player"]:checked').value;

  stompClient.connect({"username": userName}, function (frame) {
    toggleShowHide(true);
    console.log('Connected: ' + frame);

    // come from control-screen
    stompClient.subscribe('/external-device/show/question/to/specific-player',
      function (question) {
        ScreenUtil.showGameScreen(JSON.parse(question.body));
      });

    stompClient.subscribe('/show/question/to/all-player',
      function (question) {
        ScreenUtil.showGameScreen(JSON.parse(question.body));
      });

    // come from app screen
    stompClient.subscribe('/external-device/submit/answer', function (answer) {
      console.log("/external-device/submit/answer")
      var ansewrObj = JSON.parse(answer.body);
      showAnswer(ansewrObj.answer, ansewrObj.sendFrom);
    });

  });

  SessionUtil.setValueToSessionStorage("user", userName);
}

function submitAnswer(answer) {
  stompClient.send("/app-screen/submit/answer", {}, JSON.stringify({
    'answer': answer,
    'sendFrom': '',
    'sendTo': 'control-screen'
  }));
}

function disconnect() {
  if (stompClient != null) {
    stompClient.disconnect();
  }

  toggleShowHide(false);
  console.log("Disconnected");
}

function getStompClient() {
  return stompClient;
}
