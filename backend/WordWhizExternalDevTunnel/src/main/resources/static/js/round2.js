$(document).ready(() => {

 var answerWord = null;

  $('#round2_btn1, #round2_btn2, #round2_btn3, #round2_btn4').click(function() {
  	answerWord = $(this).val();
  });
  
  $('#round2_word1, #round2_word2, #round2_word3, #round2_word4').click(function() {
      $(this).find("span").html(answerWord);
  })
  
});
