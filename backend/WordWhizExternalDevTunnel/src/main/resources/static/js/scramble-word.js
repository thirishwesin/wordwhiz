const SCRAMBLE_WORD_IDS = '#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4';
const SCRAMBLE_BTN_IDS = '#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4';

$(document).ready(() => {

	var answerWord = null;
	var animationForAnswer = 'animate__animated animate__flash';
	var animationForButton = 'animate__animated animate__pulse';

	$(SCRAMBLE_BTN_IDS).click(function() {
		answerWord = $(this).val();
		$(this).css('--animate-duration', '.3s').addClass(animationForButton).one('animationend', function() {
			$(this).removeClass(animationForButton);
		});
		$(".underline-word").each(function() {
			if ($(this).hasClass('border-bottom-blue')) {
				$(this).addClass(animationForAnswer).one('animationend', function() {
					$(this).removeClass(animationForAnswer);
				});
			}
		})
	});

	$(SCRAMBLE_WORD_IDS).click(function() {
		$(this).find("p").html(answerWord);
		$(this).find("div").removeClass("border-bottom-blue").addClass("border-bottom-green");
		var answerIndex = $(this).attr("data-wz-index");
		submitAnswer(answerWord, answerIndex);
	})

});

class ScrambleWordService {
	static showQuestion(questionObj) {
		$(SCRAMBLE_WORD_IDS).find("p").css("font-size", questionObj.fontSetting.answerFontSize).html("");
		$(SCRAMBLE_BTN_IDS).find("input").css("font-size", questionObj.fontSetting.hintFontSize);
		$(".underline-word").removeClass("border-bottom-green").addClass("border-bottom-blue");
		for (let i = 1; i <= questionObj.hint.length; i++) {
			let word = questionObj.hint.charAt(i - 1);
			$("#scramble-btn" + i).attr('value', word);
			$("#scramble-btn" + i).find("input").attr('value', word);
		}
	}
}
