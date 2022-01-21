$(document).ready(function() {

  $("#btn1").click(function (){
  	setButtonDisabled("btn1");
	appendText($("#btn1").val());
  });
  
  $("#btn2").click(function (){
  	setButtonDisabled("btn2");
	appendText($("#btn2").val());
  });
  
  $("#btn3").click(function (){
  	setButtonDisabled("btn3");
	appendText($("#btn3").val());
  });
  
  $("#btn4").click(function (){
  	setButtonDisabled("btn4");
	appendText($("#btn4").val());
  });
  
  $("#btn-clear").click(() => {
    $("span").remove(".round2-word");
  	$("button").removeAttr("disabled");
  });
  
  $("#btn-submit").click(() => {
  	 submitAnswer($("#round2-answer").html());
  });
  
});

function appendText(word) {
	$("#round2-answer").append(`<span class='round2-word'>${word}</span>`);
}

function setButtonDisabled(id){
	$("#"+id).attr("disabled", true);
}
