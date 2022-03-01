const SCRAMBLE_WORD_IDS = '#scramble-word1, #scramble-word2, #scramble-word3, #scramble-word4';
const SCRAMBLE_BTN_IDS = '#scramble-btn1, #scramble-btn2, #scramble-btn3, #scramble-btn4';

$(document).ready(() => {

	var answerWord = null;
	var animationForButton = 'animate__animated animate__pulse';
	var scrambleBtnId = "";
	const clickedBtn = 'clicked-btn';

	// $(SCRAMBLE_BTN_IDS).click(function () {
	// 	answerWord = $(this).val();
	// 	scrambleBtnId = $(this).attr("id");
	// 	$(".btn.round2_btn").each(function () {
	// 		$(this).removeClass(clickedBtn)
	// 	})
	// 	$(this).css({ '--animate-duration': '.3s' }).addClass(`${animationForButton} ${clickedBtn}`).one('animationend', function () {
	// 		$(this).removeClass(animationForButton);
	// 	});
	// 	$(".underline-word").each(function () {
	// 		if ($(this).hasClass('border-bottom-blue')) {
	// 			$(this).fadeOut(100).fadeIn(100);
	// 		}
	// 	})
	// });

	$(SCRAMBLE_WORD_IDS).click(function () {
		answerWord = $(this).find("p").text();
		$(SCRAMBLE_BTN_IDS).each(function () {
			if(!$(this).find("input").val()) {
				$(this).find("input").val(answerWord);
				return false;
			}
		})
		// $(this).find("div").removeClass("border-bottom-blue").addClass("border-bottom-green");
		var answerIndex = $(this).attr("data-wz-index");
		submitAnswer(answerWord, answerIndex, scrambleBtnId);
		$(this).find("input").val(scrambleBtnId);
	})

	$('#backspace-btn').click(function() {
		const btnIdArray = SCRAMBLE_BTN_IDS.split(",");
		let btnCount = $("#scramble-btn4").is(":visible") ? btnIdArray.length-1 : btnIdArray.length - 2
		
		for(let i = btnCount; i > -1; i--) {
			if($(btnIdArray[i]).find("input").val()) {
				$(btnIdArray[i]).find("input").val("");
				break;
			}
		}
		submitAnswer(answerWord, -1, scrambleBtnId);
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
			$("#scramble-word" + i).find("p").text(word);
		}
		SessionUtil.setValueToSessionStorage("questionId", questionObj.questionId);
	}
}
