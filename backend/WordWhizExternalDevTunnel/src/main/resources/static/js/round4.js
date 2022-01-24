$(document).ready(function () {
  var canvas = document.getElementById("signature");

  var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)'
  });

  console.log(signaturePad.toData())

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
  })

  $("#submit-answer-btn-4").on('click', function () {
    submitAnswer(signaturePad.toDataURL());
  });

})
