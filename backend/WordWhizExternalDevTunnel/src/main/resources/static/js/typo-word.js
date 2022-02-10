var signaturePad;

$(document).ready(function () {
  var sign = document.getElementById("signature");

  signaturePad = new SignaturePad(sign, {
    velocityFilterWeight: 0.1,
    minWidth: 2,
    maxWidth: 6.5,
    minPointDistance: 3,
    backgroundColor: 'rgb(255, 255, 255)',
  });

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
    submitAnswer(signaturePad.toDataURL());
  })

  signaturePad.addEventListener("endStroke", _.debounce(function () {
    submitAnswer(signaturePad.toDataURL());
  }, 500));

})
