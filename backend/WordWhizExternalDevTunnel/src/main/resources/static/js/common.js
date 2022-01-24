function submitAnswer(answer) {
  getStompClient().send("/app-screen/submit/answer", {}, JSON.stringify({
    'answer': answer,
    'sendFrom': '',
    'sendTo': 'control-screen'
  }));
}

function showRound(questionObj) {
  $("#welcomeScreen").hide();
  for (let i = 1; i <= 5; i++) {
    $("#round" + i + "Screen").hide();
  }
  if (questionObj) {
    $("#round" + questionObj.round + "Screen").show();
  }
}
