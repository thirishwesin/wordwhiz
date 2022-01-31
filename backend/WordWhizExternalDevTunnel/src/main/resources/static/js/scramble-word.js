var scrambleWordIds = '#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4';

$(document).ready(() => {

	var answerWord = null;
	var animationForAnswer = 'animate__animated animate__flash';
	var animationForButton = 'animate__animated animate__pulse';

	$('#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4').click(function() {
		answerWord = $(this).val();
		$(this).css('--animate-duration', '.3s').addClass(animationForButton).one('animationend', function() {
			$(this).removeClass(animationForButton);
		});
		$(".underline-word").each(function() {
			if ($(this).hasClass('border-bottom-green')) {
				$(this).addClass(animationForAnswer).one('animationend', function() {
					$(this).removeClass(animationForAnswer);
				});
			}
		})
	});

	$(scrambleWordIds).click(function() {
		$(this).find("p").html(answerWord);
		$(this).find("div").removeClass("border-bottom-green").addClass("border-bottom-blue");
		var answerIndex = $(this).attr("data-wz-index");
		submitAnswer(answerWord, answerIndex);
	})

});

class ScrambleWordService {
	static showQuestion(questionObj) {
		$(scrambleWordIds).find("p").html("");
		$(".underline-word").removeClass("border-bottom-blue").addClass("border-bottom-green");
		for (let i = 1; i <= questionObj.hint.length; i++) {
			let word = questionObj.hint.charAt(i - 1);
			$("#scramble-btn" + i).attr('value', word);
			$("#scramble-btn" + i).find("input").attr('value', word);
		}
	}
}
