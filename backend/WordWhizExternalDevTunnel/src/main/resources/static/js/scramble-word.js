const SCRAMBLE_WORD_IDS = '#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4';
const SCRAMBLE_BTN_IDS = '#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4';

$(document).ready(() => {

	var answerWord = null;
	var animationForButton = 'animate__animated animate__pulse';
	var scrambleBtnId = "";
	const clickedBtn = 'clicked-btn';

	$(SCRAMBLE_BTN_IDS).click(function () {
		answerWord = $(this).val();
		scrambleBtnId = $(this).attr("id");
		$(".btn.round2_btn").each(function () {
			$(this).removeClass(clickedBtn)
		})
		$(this).css({ '--animate-duration': '.3s' }).addClass(`${animationForButton} ${clickedBtn}`).one('animationend', function () {
			$(this).removeClass(animationForButton);
		});
		$(".underline-word").each(function () {
			if ($(this).hasClass('border-bottom-blue')) {
				$(this).fadeOut(100).fadeIn(100);
			}
		})
	});

	$(SCRAMBLE_WORD_IDS).click(function () {
		if (answerWord) {
			$(".answer").each(function () {
				if ($(this).siblings().first().val() === scrambleBtnId) {
					$(this).text("")
					$(this).parent().removeClass("border-bottom-green").addClass("border-bottom-blue");
				}
			})
			$(SCRAMBLE_BTN_IDS).each(function () {
				if ($(this).hasClass(clickedBtn)) {
					$(this).removeClass(clickedBtn);
				}
			})
			$(this).find("p").html(answerWord);
			$(this).find("div").removeClass("border-bottom-blue").addClass("border-bottom-green");
			var answerIndex = $(this).attr("data-wz-index");
			submitAnswer(answerWord, answerIndex, scrambleBtnId);
			$(this).find("input").val(scrambleBtnId);
			answerWord = '';
		}
	})

});

class ScrambleWordService {
	static showQuestion(questionObj) {
		if (SessionUtil.getValueFromSessionStorage("questionId") != questionObj.questionId.toString()) {
			$(SCRAMBLE_WORD_IDS).each(function () {
				$(SCRAMBLE_WORD_IDS).find("p").css("font-size", questionObj.fontSetting.answerFontSize).html("");
			})
		}
		$(SCRAMBLE_BTN_IDS).find("input").css("font-size", questionObj.fontSetting.questionFontSize);
		$(".underline-word").removeClass("border-bottom-green").addClass("border-bottom-blue");
		if (questionObj.question.length == 3) {
			$("#scramble-word4").hide();
			$("#scramble-btn4").parent().hide();
		} else {
			$("#scramble-word4").show();
			$("#scramble-btn4").parent().show();
		}
		for (let i = 1; i <= questionObj.question.length; i++) {
			let word = questionObj.question.charAt(i - 1);
			$("#scramble-btn" + i).attr('value', word);
			$("#scramble-btn" + i).find("input").attr('value', word);
		}
		SessionUtil.setValueToSessionStorage("questionId", questionObj.questionId);
	}
}
