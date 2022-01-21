var stompClient = null;
var playerId = null;

function connect() {
  var socket = new SockJS('/ws');
  stompClient = Stomp.over(socket);
  stompClient.connect({
      "username": document.querySelector('input[name="player"]:checked').value
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
  sessionStorage.setItem("user", document.querySelector('input[name="player"]:checked').value);
}

function disconnect() {
  if (stompClient != null) {
    stompClient.disconnect();
  }
  setConnected(false);
  console.log("Disconnected");
}

function getStompClient() {
  return stompClient;
}
