var canvas;

$(document).ready(function() {
	var sign = document.getElementById("signature");

	var wrapper = document.getElementById("signature-pad");
	canvas = wrapper.querySelector("canvas");

	var signaturePad = new SignaturePad(sign, {
		backgroundColor: 'rgb(255, 255, 255)',
	});

	$('#clear-signature').on('click', function() {
		signaturePad.clear();
	})


	signaturePad.addEventListener("endStroke", _.debounce(function() {
		submitAnswer(signaturePad.toDataURL());
	}, 500));

	window.onresize = resizeCanvas;
	resizeCanvas();

})

function resizeCanvas() {
	var ratio = Math.max(window.devicePixelRatio || 1, 1);

	canvas.width = canvas.offsetWidth * ratio;
	canvas.height = canvas.offsetHeight * ratio;
	canvas.getContext("2d").scale(ratio, ratio);
}