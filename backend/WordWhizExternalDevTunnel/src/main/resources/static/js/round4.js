$(document).ready(function () {
  console.log("I am round 4")
  var canvas = document.getElementById("signature");

  var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)'
  });

  console.log(signaturePad.toData())

  $('#clear-signature').on('click', function () {
    signaturePad.clear();
  })

  $('#undo-signature').on('click', function () {
    var data = signaturePad.toData();

    if (data) {
      data.pop();
      signaturePad.fromData(data);
    }
  })

  function submitAnswer() {
    getStompClient().send("/app-screen/submit/answer", {}, JSON.stringify({
      'answer': signaturePad.toDataURL(),
      'sendFrom': '',
      'sendTo': 'control-screen'
    }));
  }

  $("#submit-answer-btn-4").click(function () {
    submitAnswer();
  });

})
