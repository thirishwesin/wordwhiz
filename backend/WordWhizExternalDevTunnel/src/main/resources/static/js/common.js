const screenIdList = ['choose-player-screen', 'welcome-screen', 'scramble-word-screen', 'typo-word-screen', 'quizSection'];


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
    $("#welcome-player-name").text(SessionUtil.getValueFromSessionStorage("user"));
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

  static showTypoWord() {
    let tempScreenIdList = screenIdList.filter(s => s != 'typo-word-screen');
    for (const screen of tempScreenIdList) {
      $("#" + screen).hide();
    }
    $("#wordwhiz-container").attr('class', 'typo_bg_theme');
    $("#typo-word-screen").show();
  }

  static showGameScreen(questionObj) {
    switch (questionObj.round) {
      case 2:
        ScrambleWordService.showQuestion(questionObj);
        this.showScrambleWord();
        break
      case 4:
        this.showTypoWord();
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

  static removeFromSessionStorage(key){
    sessionStorage.removeItem(key);
  }

  static removeAll(){
    sessionStorage.clear();
  }
}

