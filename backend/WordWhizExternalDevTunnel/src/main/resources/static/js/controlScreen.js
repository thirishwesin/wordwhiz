function sendSpecificPlayer() {
  getStompClient().send("/control-screen/show/question/to/specific-player", {}, JSON.stringify({
    'question': $("#question").val(),
    'round': document.querySelector('input[name="rounds"]:checked').value,
    'toPlayer': document.querySelector('input[name="players"]:checked').value
  }));
}

function sendAllPlayer() {
  getStompClient().send("/control-screen/show/question/to/all-player", {}, JSON.stringify({
    'question': $("#question").val(),
    'round': document.querySelector('input[name="rounds"]:checked').value,
    'toPlayer': document.querySelector('input[name="players"]:checked').value
  }));
}

function showAnswer(answer, sendFrom) {
  $("#answers").append("<li>" + answer + "  (" + sendFrom + ")</li>");
}
