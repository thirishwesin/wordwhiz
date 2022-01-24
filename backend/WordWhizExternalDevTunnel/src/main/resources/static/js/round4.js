$(document).ready(function () {
  var canvas = document.getElementById("signature");

  var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)',
  });

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
  })


  signaturePad.addEventListener("endStroke", _.debounce(function () {
    submitAnswer(signaturePad.toDataURL());
  }, 500));

})
