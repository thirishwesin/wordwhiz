$(document).ready(() => {

  var answerWord = null;

  $('#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4').click(function () {
    answerWord = $(this).val();
  });

  $('#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4').click(function () {
    $(this).find("span").html(answerWord);
    var answerIndex = $(this).attr("id");
    submitAnswer(answerWord, answerIndex);
  })

});

class ScrambleWordService {
  static showQuestion(questionObj) {
    for (let i = 1; i < questionObj.question.length; i++) {
      let word = questionObj.question.charAt(i - 1);
      $("#scramble-btn" + i).attr('value', word);
      $("#scramble-btn" + i).html(word);
    }
  }
}
