var scrambleWordIds = '#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4';

$(document).ready(() => {

  var answerWord = null;

  $('#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4').click(function () {
    answerWord = $(this).val();
  });

  $(scrambleWordIds).click(function () {
    $(this).find("span").html(answerWord);
    var answerIndex = $(this).attr("data-wz-index");
    submitAnswer(answerWord, answerIndex);
  })

});

class ScrambleWordService {
  static showQuestion(questionObj) {
  $(scrambleWordIds).find("p").html("");
    for (let i = 1; i <= questionObj.hint.length; i++) {
      let word = questionObj.hint.charAt(i - 1);
      $("#scramble-btn" + i).attr('value', word);
      $("#scramble-btn" + i).find("input").attr('value', word);
    }
  }
}
