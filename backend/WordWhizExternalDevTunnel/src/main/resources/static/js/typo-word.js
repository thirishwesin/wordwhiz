var canvas;
var signaturePad;

$(document).ready(function () {
  var sign = document.getElementById("signature");

  var wrapper = document.getElementById("signature-pad");
  canvas = wrapper.querySelector("canvas");

  signaturePad = new SignaturePad(sign, {
    backgroundColor: 'rgb(255, 255, 255)',
    dotSize:'1',
    minWidth:'1.5',
    minWidth:'3',
  });

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
    submitAnswer(signaturePad.toDataURL());
  })

  signaturePad.addEventListener("endStroke", _.debounce(function () {
    submitAnswer(signaturePad.toDataURL());
  }, 500));

})
