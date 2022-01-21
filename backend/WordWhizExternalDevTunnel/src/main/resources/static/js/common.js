function submitAnswer(answer) {
  getStompClient().send("/app-screen/submit/answer", {}, JSON.stringify({
    'answer': answer,
    'sendFrom': '',
    'sendTo': 'control-screen'
  }));
}

function showQuestion(questionObj) {
  if (questionObj.round == 'round2') {
    $("#round2Screen").show();
    $("#round4Screen").hide();
  }
  if (questionObj.round == 'round4') {
    $("#round4Screen").show();
    $("#round2Screen").hide();
  }
  $("#questions").append("<li>" + questionObj.question + "</li>");
}
