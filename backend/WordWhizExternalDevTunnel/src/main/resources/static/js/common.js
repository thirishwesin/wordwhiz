const screenIdList = ['choose-player-screen', 'welcome-screen', 'scramble-word-screen', 'typo-word-screen'];


class ScreenUtil {

  static showScreen(screenName) {
    let tempScreenIdList = screenIdList.filter(s => s != screenName);
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#" + screenName).show();
  }


  static showChoosePlayerScreen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'choose-player-screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#wordwhiz-container").attr('class', 'bg_theme');
    $("#choose-player-screen").show();
  }

  static showWelcomeScreen() {
    let tempScreenIdList = screenIdList.filter(s => s != 'welcome-screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#wordwhiz-container").attr('class', 'bg_theme');
    $("#welcome-player-name").text(SessionUtil.getValueFromSessionStorage("user-name"));
    $("#welcome-screen").show();
  }

  static showScrambleWord() {
    let tempScreenIdList = screenIdList.filter(s => s != 'scramble-word-screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#wordwhiz-container").attr('class', 'bg_theme');
    $("#scramble-word-screen").show();
  }

  static showTypoWord(questionObj) {
    if (SessionUtil.getValueFromSessionStorage("questionId") != questionObj.questionId.toString()) {
      signaturePad.clear();
    }

    let tempScreenIdList = screenIdList.filter(s => s != 'typo-word-screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }

    $("#typo-word-question").text(questionObj.question);
    $("#wordwhiz-container").attr('class', 'typo_bg_theme');
    $("#typo-word-screen").show();
    SessionUtil.setValueToSessionStorage("questionId", questionObj.questionId)
  }

  static showGameScreen(questionObj) {
    questionObj.isLock ? $(".lock_screen").show() : $(".lock_screen").hide();
    switch (questionObj.round) {
      case 0:
        this.showWelcomeScreen()
        break;
      case 8:
        ScrambleWordService.showQuestion(questionObj);
        this.showScrambleWord();
        break
      case 7:
        this.showTypoWord(questionObj);
        break;
    }
  }
}

class SessionUtil {
  static setValueToSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
  }

  static getValueFromSessionStorage(key) {
    return sessionStorage.getItem(key);
  }

  static removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
  }

  static removeAll() {
    sessionStorage.clear();
  }
}

