const screenIdList = ['choosePlayerScreen', 'welcomeScreen', 'round2Screen', 'round4Screen','quizSection'];

class ScreenUtil {

  static showScreen(screenName) {
    let tempScreenIdList = screenIdList.filter(s => s != screenName);
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#" + screenName).show();
  }

  static showQuizSection() {
    let tempScreenIdList = screenIdList.filter(s => s != 'quizSection');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#quizSection").show();
  }

  static showChoosePlayerScreen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'choosePlayerScreen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#choosePlayerScreen").show();
  }

  static showWelcomeScreen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'welcomeScreen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#welcomePlayerName").text(sessionStorage.getItem("user"));
    $("#welcomeScreen").show();
  }

  static showRound2Screen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'round2Screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#round2Screen").show();
  }

  static showRound4Screen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'round4Screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#round4Screen").show();
  }

  static showRound(questionObj) {
    switch (questionObj.round) {
      case 2:
        RoundTwoService.showQuestion(questionObj);
        this.showRound2Screen();
        break
      case 4:
        this.showRound4Screen();
        break;
    }
  }
}

