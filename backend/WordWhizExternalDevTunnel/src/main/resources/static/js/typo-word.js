var signaturePad;

$(document).ready(function () {
  var sign = document.getElementById("signature");

  signaturePad = new SignaturePad(sign, {
    minWidth: 2,
    maxWidth: 4.5,
    penColor: 'rgb(255, 0, 0)',
    backgroundColor: 'rgb(255, 255, 255,0.1)',
  });

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
    submitAnswer(signaturePad.toDataURL());
  })

  signaturePad.addEventListener("endStroke", _.debounce(function () {
    submitAnswer(signaturePad.toDataURL());
  }, 500));

})
