import { Player } from './../../core/models/player';
import { Component, OnInit, NgZone } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, from } from "rxjs";
import { WordWhiz } from "../../core/models/wordWhiz";
import { BrowserWindow, remote } from "electron";
import * as url from "url";
import * as path from "path";
import { AppConfig } from "../../../environments/environment";
import * as _ from "lodash";
import {
  initControlStore,
  updateCurrentRoundId,
  updateStartCount,
  updateCurrentQuestionId,
  updateShowQuestion,
  updateShowAns,
  updateExraWord,
  resetCategoryRound,
  runCategoryRound,
  endCategoryRound,
  ShowAnsForCategoryRound,
  updateClickPoint,
  resetTimeOut,
  updateClickTimer,
  animatedExtraWord,
  updatePlayerScreenBackground
} from "../../core/actions/control.actions";
import {
  initEpisodeStore,
  updateEpisodeStore
} from "../../core/actions/episode.actions";
import * as spin from '../spinner-wheel/spinner-wheel.component'
import { Images } from "../../common/images";
import { readFile, readFileSync } from "fs";
import {
  faPlayCircle,
  faSortUp,
  faSortDown,
  faCircle
} from "@fortawesome/free-solid-svg-icons";
import { Episode } from "../../core/models/episode";
import { Control } from "../../core/models/control";
import { Question } from "../../core/models/question";
import { Round } from "../../core/models/round";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { saveFile } from "../../common/functions";
import { QuestionCategory } from "../../core/models/questionCategory";
import fontSizeForWindow from "../../../assets/fonts/fontSizeForWindow.json";
import { TimerEnum } from '../../core/models/timerEnum';
import { WebsocketService } from '../../core/services/websocket.service';
import { ExternalDevice } from '../../core/models/externalDevice';
import { offlineUser, onlineUser, wordWhizIsConnected } from '../../core/actions/externalDevice.actions';
import { CompatClient, IFrame, IMessage, Stomp } from '@stomp/stompjs';
import { ExternalDeviceQuestion } from '../../core/models/externalDeviceQuestion';

@Component({
  selector: "app-control",
  templateUrl: "./control.component.html",
  styleUrls: ["./control.component.scss"]
})
export class ControlComponent implements OnInit {
  newWindows = [];
  wordWhiz: WordWhiz;
  episode: Episode;
  control: Control;
  externalDevice: ExternalDevice
  currentRound: Round;
  currentQuestion: Question;
  Images = Images;

  faPlayCircle = faPlayCircle;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faCircle = faCircle;

  ansCharArr = [];
  timeOut;
  interval;

  currentCategory: QuestionCategory;
  currentQuestionIndex: number;

  runCategoryRound = false;
  questionArraysByCategory = {};
  loopQuestion = false;
  correctAnswerCount = 0;
  finishCategoryRound = false;
  noQuestionByCategory = false;
  audio = null;
  count10sec = null;
  count5sec = null;
  wrong_answer_audio = null;
  correct_answer_audio = null;
  disableStart = false;

  resetFontValue: any;

  defaultFontValue: {
    main_roundName: 45;
    main_clue: 45;
    main_hint: 47;
    main_answer: 47;
    main_timeOut: 50;
    oneThird_timeOut: 25;
    oneThird_hint: 35;
    oneThird_answer: 35;
    player_point: 134;
  };

  fontSizeWarning: boolean = false;
  isFullScreen: boolean = false;
  windowSize: number[];
  recommendFontSize: any;
  correctAnswerDisable = false;
  isStartRound4 = false;
  oldCurrentRound: Round
  oldCurrentPlayer: Player[]
  roundFourHintValue: string
  currentCategoryForR4: any;
  isPlay: boolean = false;
  r4CategoryName: string = "Player One"
  r4CategoryId: number = 0
  currentRoundName: string = '第一回合'
  currentPoint: number
  spinnerWheelNo: number
  isSpinningWheel: boolean = true

  //Vairbles for websocket
  stompClient: CompatClient
  onlineUsers: string[] = []
  externalDevPlayerId: string
  showQuestionInTablet: boolean = false;

  constructor(
    private store: Store<{
      wordWhiz: WordWhiz;
      episode: Episode;
      control: Control;
      externalDevice: ExternalDevice
    }>,
    public modalService: NgbModal,
    private router: Router,
    readonly nz: NgZone,
    private websocketService: WebsocketService
  ) {
    store.subscribe(item => {
      this.wordWhiz = item.wordWhiz;
      this.episode = item.episode;
      this.control = item.control;
      this.externalDevice = item.externalDevice;
      // for dev
      if (this.wordWhiz.fontSettings == null) {
        this.control.fontSettings = {
          main_roundName: 45,
          main_clue: 45,
          main_hint: 47,
          main_answer: 47,
          main_timeOut: 50,
          oneThird_timeOut: 25,
          oneThird_hint: 35,
          oneThird_answer: 35,
          player_point: 134,
          externalDeviceSetting: {
            websocketUrl: "ws://localhost:8081/ws/websocket"
          },
          screenPropertytSetting: {
            spinnerWheelDuration: 10
          }
        };

        // for production
      } else {
        this.control.fontSettings = this.wordWhiz.fontSettings;
      }
      if (this.control.currentEpisodeId !== 0 && this.episode.id !== 0) {
        //update the localStorage
        localStorage.setItem("control", JSON.stringify(this.control));
        localStorage.setItem("episode", JSON.stringify(this.episode));
      } else {
        //get from localStorage (reload state)
        this.store.dispatch(
          initControlStore({
            control: JSON.parse(localStorage.getItem("control"))
          })
        );
        this.store.dispatch(
          initEpisodeStore({
            episode: JSON.parse(localStorage.getItem("episode"))
          })
        );
      }
      this.updatePlayerActiveStatus();
    });
    // sort by roundName
    //this.episode.rounds.sort((a,b) => (a.roundName > b.roundName) ? 1 : ((b.roundName > a.roundName) ? -1 : 0))
    this.recommendFontSize = fontSizeForWindow.normalSize;
  }

  get timerEnum(): typeof TimerEnum { return TimerEnum }

  ngOnInit() {
    this.recommendFontSize = fontSizeForWindow.normalSize;
    try {
      const timer = document.images.namedItem("timer");
      const timerImag = new Image();
      timerImag.onload = () => {
        timer.src = timerImag.src;
      };

      if (AppConfig.production) {
        timerImag.src =
          process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/timer.png";
        this.audio = new Audio(
          process.env.PORTABLE_EXECUTABLE_DIR + "/data/audios/ClockTicking.mp3"
        );
        this.count10sec = new Audio(
          process.env.PORTABLE_EXECUTABLE_DIR +
          "/data/audios/10secCountDown.mp3"
        );
        this.count5sec = new Audio(
          process.env.PORTABLE_EXECUTABLE_DIR + "/data/audios/5secCountDown.mp3"
        );
        this.wrong_answer_audio = new Audio(
          process.env.PORTABLE_EXECUTABLE_DIR + "/data/audios/Wrong_answer.mp3"
        );
        this.correct_answer_audio = new Audio(
          process.env.PORTABLE_EXECUTABLE_DIR +
          "/data/audios/Correct_answer.mp3"
        );
      } else {
        timerImag.src = "../../../assets/images/temp/timer.png";
        this.audio = new Audio("../../../assets/audios/ClockTicking.mp3");
        this.count10sec = new Audio(
          "../../../assets/audios/10secCountDown.mp3"
        );
        this.count5sec = new Audio("../../../assets/audios/5secCountDown.mp3");
        this.wrong_answer_audio = new Audio(
          "../../../assets/audios/Wrong_answer.mp3"
        );
        this.correct_answer_audio = new Audio(
          "../../../assets/audios/Correct_answer.mp3"
        );
      }
    } catch (err) {
      // Here you get the error when the file was not found,
      // but you also get any other error
      alert("Please update the data folder!");
      this.router.navigate(["/home"], { queryParams: { id: "control" } });
    }

    this.audio.loop = true;

    this.currentQuestionIndex = 1;
    console.log("wordWhiz state in control", this.wordWhiz);
    console.log("episode state in control", this.episode);
    console.log("control state in control", this.control);

    this.updateControlState();

    // remote.getCurrentWindow().on("close", e => {
    //   //saveFile before quit
    //   saveFile(this.wordWhiz, () => {});
    // });
    if (this.wordWhiz && this.wordWhiz.questionTypes.length !== 0) {
      //not save in reload state
      window.onbeforeunload = e => {
        saveFile(this.wordWhiz, () => { });
      };
    }
  }

  //Start -- WebSocketConnection
  initWebSocketConnection(websocketUrl: string): void {
    // create CompatClient
    this.stompClient = Stomp.over(function () {
      return new WebSocket(websocketUrl)
    });
    // listen websocket server and client is disconnected.
    this.stompClient.onWebSocketClose = (evt) => {
      this.store.dispatch(wordWhizIsConnected({ isConnected: false }))
    }

    let that = this;
    // connect to websocket server
    this.stompClient.connect({ username: 'control-screen' },
      // connectCallback
      function (frame: IFrame) {
        // if client have already connected, retrieve online users from server
        if (frame.command === 'CONNECTED') {
          that.stompClient.send("/control-screen/get/online-users");
          that.store.dispatch(wordWhizIsConnected({ isConnected: true }))
        }
        // subscribe external device data
        that.subscribeExternalDevice()
      },
      // errorCallback
      function (error) {
        console.log("STOMP error ", error);
      }
    );
  }

  disconnect(): void {
    if (this.stompClient != null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  sendQuestionToExternalDevice(sendTo: string, currentRoundId: number): void {
    if (this.stompClient && (this.currentRound.questionType == 8 || this.currentRound.questionType == 7)) {
      let externalDevQuestion = this.getExternalDeviceQuestion(currentRoundId);
      console.log('externalDevQuestion: ', externalDevQuestion)
      switch (sendTo) {
        case 'specific-player':
          this.sendToSpecificPlayer(externalDevQuestion)
          break;
        case 'all-player':
          this.sendToAllPlayer(externalDevQuestion)
          break;
        default:
          break;
      }
    }
  }

  sendToSpecificPlayer(externalDevQuestion: ExternalDeviceQuestion): void {
    let question = JSON.stringify(externalDevQuestion);
    this.stompClient.send("/control-screen/show/question/to/specific-player", {}, question);
  }

  sendToAllPlayer(externalDevQuestion: ExternalDeviceQuestion): void {
    let question = JSON.stringify(externalDevQuestion);
    this.stompClient.send("/control-screen/show/question/to/all-player", {}, question);
  }

  getExternalDeviceQuestion(currentRoundId: number): ExternalDeviceQuestion {
    let externalDeviceQuestion: ExternalDeviceQuestion = {
      question: this.currentQuestion.clue,
      hint: this.currentQuestion.hints[0].value,
      timeout: this.currentRound.timeOut,
      playerId: `player${this.externalDevPlayerId}`,
      currentQuestionId: this.control.currentQuestionId,
      currentRoundId: currentRoundId,
      currentEpisodeId: this.control.currentEpisodeId,
      fontSetting: {
        questionFontSize: +this.currentQuestion.tabletClueFontSize,
        hintFontSize: +this.currentQuestion.hints[0].tabletHintFontSize,
        answerFontSize: +this.currentQuestion.tabletAnsFontSize
      }
    }
    return externalDeviceQuestion;
  }

  subscribeExternalDevice() {
    let that = this;
    this.stompClient.subscribe('/external-device/submit/answer', function (answer: IMessage) {
      let answerObj = JSON.parse(answer.body);
      that.newWindows.forEach((mainWindow: BrowserWindow) => {
        mainWindow.webContents.send("submit-answer", answerObj);
      })
    });
    this.stompClient.subscribe('/external-device/get/online-users', function (userInfo: IMessage) {
      let usernames: string[] = JSON.parse(userInfo.body);
      console.log('usernames: ', usernames)
      usernames.forEach(username => {
        that.store.dispatch(onlineUser({ onlineUser: username }))
      });
    });
    this.stompClient.subscribe('/external-device/send/online-user', function (userInfo: IMessage) {
      let username = userInfo.body;
      that.store.dispatch(onlineUser({ onlineUser: username }))
    });
    this.stompClient.subscribe('/external-device/send/offline-user', function (userInfo: IMessage) {
      let username = userInfo.body;
      that.store.dispatch(offlineUser({ offlineUser: username }))
    });
  }
  //End -- WebSocketConnection

  updateControlState() {
    // clear control extraWord array
    this.control.extraWord = [];
    this.control.roundFourStatus = [{ id: 1, imagePath: './assets/images/blue_rectangle.png' }, { id: 2, imagePath: './assets/images/blue_rectangle.png' }, { id: 3, imagePath: './assets/images/blue_rectangle.png' }]
    if (this.control.finishCategoryRound) this.isStartRound4 = false;

    //update current round
    this.currentRound = _.find(this.episode.rounds, [
      "id",
      this.control.currentRoundId
    ]);
    // update current point
    this.currentPoint = this.currentRound.point
    console.log('current round => ', this.currentRound)
    //update current question
    this.currentQuestion = _.find(this.currentRound.questionArray, [
      "id",
      this.control.currentQuestionId
    ]);

    if (this.currentRound.questionType == 2) {
      console.log(' before current category for round four => ', this.currentCategoryForR4)
      if (!this.currentCategoryForR4) {
        this.currentCategoryForR4 = this.currentRound.categories.length > 0 ? this.currentRound.categories[0] : undefined;
      }
      console.log(' after current category for round four => ', this.currentCategoryForR4)
    }

    // push control extraWord
    if (this.currentQuestion && this.currentQuestion.isAnsCharacter)
      this.ansCharArr = this.currentQuestion.ans.split("");

    this.ansCharArr.map(word => {
      this.control.extraWord.push({
        word: word,
        visible: false
      });
    });

    //update timeOut count except when running round4
    if (!this.runCategoryRound && !this.finishCategoryRound) {
      this.timeOut = this.currentRound.timeOut;
      this.audio.pause();
      this.audio.currentTime = 0;
      this.count10sec.pause();
      this.count10sec.currentTime = 0;
      this.count5sec.pause();
      this.count5sec.currentTime = 0;
    }

    //initialize current Question Category
    if (!this.currentCategory && (this.currentRound.questionType == 4 || this.currentRound.questionType == 7)) {
      this.currentCategory =
        this.currentRound.categories.length > 0
          ? this.currentRound.categories[0]
          : undefined;
    }

    if (
      this.currentRound.hasCategory &&
      _.isEmpty(this.questionArraysByCategory)
    ) {
      //separate arrays by categoryId
      this.currentRound.categories.map(category => {
        this.questionArraysByCategory[category.id] = _.filter(
          this.currentRound.questionArray,
          question => question.categoryId == category.id
        );

        //set flag for actions (unset=0,correct=1,wrong=2,skip=3)
        _.map(this.questionArraysByCategory[category.id], question => {
          question.actions = 0;
        });
      });
    }
  }

  questionDropDownByCategory = () => {
    if (this.currentRound.hasCategory && this.currentCategory) {
      return this.questionArraysByCategory[this.currentCategory.id];
    } else return this.currentRound.questionArray;
  };

  questionArrForR4() {
    if (this.currentRound.questionType == 7)
      return this.currentRound.questionArray.filter(question => question.categoryId == this.r4CategoryId)
    return this.currentRound.questionArray.filter(question => question.categoryId == this.currentCategoryForR4.id)
  }

  newWindow(playerId) {
    let route = "player";
    let params = "?id=" + playerId;

    let title = '';

    if (playerId == 0) {
      route = "main";
      params = "";
      title = "Main"
    } else if (playerId == 1) {
      title = "Player 1"
    } else if (playerId == 2) {
      title = "Player 2"
    } else if (playerId == 3) {
      title = "Player 3"
    } else if (playerId == 13) {
      route = "oneThird";
      params = "";
      title = "One Third"
    } else if (playerId == 14) {
      route = "spinner-wheel";
      params = "";
      title = "Spinner Wheel"
    }

    let broadCastData = {
      control: this.control,
      episode: this.episode
    };

    const BrowserWindow = remote.BrowserWindow;
    let windowData;
    if (playerId == 13) {
      windowData = {
        width: 1200,
        height: 600
        // x: 0,
        // y: Number(((size[1] / 3) * 2).toFixed()),
        // width: size[0],
        // height: Number((size[1] / 3).toFixed()),
      };
    } else {
      windowData = {
        width: 1200,
        height: 600
        // width: size[0],
        // height: size[1]
      };
    }
    // Create a browser window.
    var newWindow = new BrowserWindow({
      ...windowData,
      fullscreen: false,
      //frame: false,
      title: title,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        // devTools: !AppConfig.production
        webSecurity: AppConfig.production
      }
    });

    newWindow.on("close", e => {
      let index = this.newWindows.indexOf(newWindow);
      if (index != -1) {
        this.newWindows.splice(index, 1)
      }
    });

    this.newWindows.push(newWindow);

    // set the page on the new window
    if (AppConfig.production) {
      newWindow.loadURL(
        url.format({
          pathname: path.join(__dirname, "./index.html"), // production build
          protocol: "file:",
          slashes: true,
          hash: "/" + route + params
        })
      );
    } else {
      newWindow.loadURL("http://localhost:4200/#/" + route + params); // for development
    }

    //update store for new window
    newWindow.webContents.on("dom-ready", () => {
      newWindow.webContents.send("word_whizControl", broadCastData);
    });

    console.log("open windows", this.newWindows);

    // if resize main or oneThird or player screens get windowSize
    newWindow.on("resize", () => {
      this.windowSize = newWindow.getSize();

      console.log("window reiszable >> ", this.windowSize);

      if (this.windowSize[0] < 1601)
        this.recommendFontSize = fontSizeForWindow.normalSize;
      else if (this.windowSize[0] < 2881)
        this.recommendFontSize = fontSizeForWindow.ExtraSize;
      else this.recommendFontSize = fontSizeForWindow["4kSize"];
    });

    return newWindow;
  }

  openAll() {
    this.newWindow(0); //open main
    this.newWindow(13); //open oneThinrd screen
    this.openSpinnerWheelScreen();
    this.episode.players.map(player => {
      this.newWindow(player.id); //open player
    });
  }

  openModel(content_control) {
    console.log('word whiz => ', this.wordWhiz.episodes)
    // close all child windows ,save and navigate back
    this.modalService
      .open(content_control, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
          clearInterval(this.interval);

          this.audio.pause();
          this.count10sec.pause();
          this.count5sec.pause();

          this.newWindows.map(w => {
            try {
              w.close();
            } catch (error) { }
          });
          if (AppConfig.production) {
            //hot reload issue in development
            saveFile(this.wordWhiz, () => { });
          }
          console.log('word whiz => ', this.wordWhiz.episodes)
          // saveFile(this.wordWhiz, () => { });
          this.router.navigate(["/home"], { queryParams: { id: "control" } });
          this.disconnect();
        },
        reason => reason
      );
  }

  broadcastScreens() {
    let currentRoundIndex = _.findIndex(this.episode.rounds, ['id', this.currentRound.id])
    this.episode.rounds[currentRoundIndex] = this.currentRound
    this.currentQuestion = _.find(this.currentRound.questionArray, ['id', this.currentQuestion.id])
    let broadCastData = {
      control: this.control,
      episode: this.episode
    };
    broadCastData.control['resetTo'] = this.timeOut
    broadCastData.control['spinnerWheelNo'] = this.spinnerWheelNo   // Look at the picture and guess (round 5)
    console.log('this.control  : ', this.control)

    setTimeout(() => {
      this.fontSizeWarning = false;
    }, 1500);

    this.newWindows.map(window => {
      try {
        window.webContents.send("word_whizControl", broadCastData);
      } catch (e) { }
    });
  }

  prevRound() {
    let prevRound = this.currentRound;
    console.log('pervRound => ', prevRound)
    if (this.currentRound.id != 1) {
      let index = _.findIndex(this.episode.rounds, ['id', this.currentRound.id])
      prevRound = this.episode.rounds[index - 1]
      if (prevRound) this.clickRound(prevRound);
    }
  }

  nextRound() {
    let nextRound = this.currentRound;
    let lastRound: Round = _.last(this.episode.rounds)
    console.log("lastRound: ", _.last(this.episode.rounds))
    if (this.currentRound.id != lastRound.id) {
      let index = _.findIndex(this.episode.rounds, ['id', this.currentRound.id])
      nextRound = this.episode.rounds[index + 1]
      if (nextRound) this.clickRound(nextRound);
    }
  }

  clickRound(round) {
    this.spinnerWheelNo = undefined
    if (this.currentRound.questionType == 8 || this.currentRound.questionType == 7) {
      this.externalDevPlayerId = undefined
      this.control.currentPlayerId = undefined
      this.showQuestionInTablet = false
    }
    this.currentRoundName = round.roundName
    //reset the category section
    if (round.questionType == 2) this.currentCategoryForR4 = undefined
    this.roundFourHintValue = undefined
    this.resetCategorySection();
    this.store.dispatch(resetCategoryRound());

    clearInterval(this.interval);
    this.store.dispatch(updateCurrentRoundId({ currentRoundId: round.id }));
    this.updateControlState();
    this.broadcastScreens();
    this.sendQuestionToExternalDevice('all-player', 0);
  }

  changeCategory(category) {
    this.resetCategorySection();
    this.store.dispatch(resetCategoryRound());

    this.currentCategory = category;

    let firstQuestionByCategoryId = _.find(this.currentRound.questionArray, [
      "categoryId",
      category.id
    ]);

    clearInterval(this.interval);

    if (firstQuestionByCategoryId) {
      this.noQuestionByCategory = false;
      //update question when changing question category
      this.clickQuestion(firstQuestionByCategoryId, 1);
    } else {
      //no question by category
      this.noQuestionByCategory = true;
    }
  }

  toggleFullScreen() {
    if (remote.getCurrentWindow().isFullScreen()) {
      remote.getCurrentWindow().setFullScreen(false);
      this.isFullScreen = remote.getCurrentWindow().isFullScreen();
      this.newWindows.map(window => {
        if (!window.isDestroyed()) window.setFullScreen(false);
      });
    } else {
      remote.getCurrentWindow().setFullScreen(true);
      this.newWindows.map(window => {
        if (!window.isDestroyed()) window.setFullScreen(true);
      });
      this.isFullScreen = remote.getCurrentWindow().isFullScreen();
    }
  }

  resetTimer(timeOut: number) {
    this.timeOut = timeOut;//this.currentRound.timeOut;
    this.changeCurrentPoint(timeOut);
    this.disableStart = false;

    this.resetAudio();

    if (this.currentRound.hasCategory) {
      //reset for round4 section
      this.changeCategory(this.currentCategory);
    }

    // this.audio.pause();

    this.store.dispatch(resetTimeOut());

    this.broadcastScreens();
  }

  resetAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.count10sec.pause();
    this.count10sec.currentTime = 0;
    this.count5sec.pause();
    this.count5sec.currentTime = 0;
  }

  resetCategorySection() {
    this.isStartRound4 = false;
    this.disableStart = false;
    //reset the category section
    this.currentQuestionIndex = 1;
    this.runCategoryRound = false;
    this.questionArraysByCategory = [];
    this.loopQuestion = false;
    this.correctAnswerCount = 0;
    this.finishCategoryRound = false;
  }

  prevQuestion() {
    let prevQuestion = this.currentQuestion;
    if (this.currentQuestion.id != 1) {
      if (this.currentRound.questionType == 7) {
        prevQuestion = _.find(this.questionArrForR4(), [
          "id",
          this.currentQuestion.id - 1
        ]);
      } else {
        prevQuestion = _.find(this.currentRound.questionArray, [
          "id",
          this.currentQuestion.id - 1
        ]);
      }
      if (prevQuestion) this.clickQuestion(prevQuestion, 1);
    }
    // else if (this.currentQuestion.id != 1 && this.currentRound.questionType == 2) {
    //   prevQuestion = _.find(this.questionArrForR4(), [
    //     "id",
    //     this.currentQuestion.id - 1
    //   ]);
    //   if (prevQuestion) this.clickQuestion(prevQuestion, 1);
    // }
  }

  nextQuestion() {
    let nextQuestion = this.currentQuestion;

    if (this.currentQuestion.id != this.currentRound.questionArray.length) {
      if (this.currentRound.questionType == 7) {
        nextQuestion = _.find(this.questionArrForR4(), [
          "id",
          this.currentQuestion.id + 1
        ]);
      } else {
        nextQuestion = _.find(this.currentRound.questionArray, [
          "id",
          this.currentQuestion.id + 1
        ]);
      }
      if (nextQuestion) this.clickQuestion(nextQuestion, 1);
    }
    // else if (this.currentQuestion.id != this.questionArrForR4().length && this.currentRound.questionType == 2) {
    //   nextQuestion = _.find(this.questionArrForR4(), [
    //     "id",
    //     this.currentQuestion.id + 1
    //   ]);
    //   if (nextQuestion) this.clickQuestion(nextQuestion, 1);
    // }
  }

  changeCategoryForR4(category) {
    this.resetCategorySection();
    this.store.dispatch(resetCategoryRound());
    this.currentCategoryForR4 = category;
    let firstQuestionByCategoryId = _.find(this.currentRound.questionArray, [
      "categoryId",
      category.id
    ]);
    this.questionArrForR4();
    this.clickQuestion(firstQuestionByCategoryId, 1)
  }

  clickQuestion(question, currentQuestionIndex) {
    if (this.currentRound.questionType == 8 || this.currentRound.questionType == 7) {
      this.externalDevPlayerId = undefined
      this.control.currentPlayerId = undefined
      this.showQuestionInTablet = false
    }
    this.roundFourHintValue = undefined
    this.disableStart = false;
    if (this.currentRound.hasCategory)
      this.currentQuestionIndex = currentQuestionIndex;

    if (!this.currentRound.hasCategory) clearInterval(this.interval);

    let updateData = {
      currentQuestionId: question.id,
      startCount: this.runCategoryRound ? TimerEnum.START : TimerEnum.STOP, //timer should still run when running round4
      finishCategoryRound: this.finishCategoryRound,
      isChangePlayerBgImage: this.control.isChangePlayerBgImage
    };

    if (!this.finishCategoryRound) {
      //for normal Round
      this.updateCurrentQuestion(updateData);
    } else {
      //for show skpped question in end of round 4
      updateData["showQuestion"] = true;
      updateData["showAns"] = false;
      this.updateCurrentQuestion(updateData);

      setTimeout(() => {
        //after 1s show answer
        updateData["showQuestion"] = true;
        updateData["showAns"] = true;
        this.updateCurrentQuestion(updateData);
      }, 1000);
    }

    if (this.currentRound.questionType === 4) {
      this.control.roundFourStatus = [{ id: 1, imagePath: './assets/images/blue_rectangle.png' }, { id: 2, imagePath: './assets/images/blue_rectangle.png' }, { id: 3, imagePath: './assets/images/blue_rectangle.png' }]
    }

    this.sendQuestionToExternalDevice('all-player', 0);
  }

  updateCurrentQuestion(updateData) {
    this.store.dispatch(updateCurrentQuestionId({ control: updateData }));
    this.updateControlState();
    this.broadcastScreens();
  }

  toggleAnswer() {
    clearInterval(this.interval);
    this.audio.pause();
    this.count10sec.pause();
    this.count5sec.pause();

    // for round 5 extra word visible
    if (!this.control.showAns && this.currentRound.questionType == 5) {
      _.map(this.control.extraWord, extraWord => {
        extraWord.visible = true;
      });
      this.store.dispatch(
        updateExraWord({ extraWord: this.control.extraWord })
      );
      this.store.dispatch(animatedExtraWord({ animationExtraWord: "" }));
      console.log("extraWord >> ", this.control.extraWord);
    } else if (this.control.showAns && this.currentRound.questionType == 5) {
      _.map(this.control.extraWord, extraWord => {
        extraWord.visible = false;
      });
      this.store.dispatch(
        updateExraWord({ extraWord: this.control.extraWord })
      );
    }

    // play audio if press Show Answer button
    if (!this.control.showAns) this.correct_answer_audio.play();
    if(this.currentRound.questionType == 2) this.correct_answer_audio.play();

    this.control.startCount = TimerEnum.STOP;
    this.control.showAns = this.currentRound.questionType == 2 && this.control.showAns ? this.control.showAns: !this.control.showAns;
    this.control.clickPoint = false;
    this.control.resetCount = false;
    // this.store.dispatch(updateShowAns({ control: { ...this.control } }));
    this.store.dispatch(
      updateClickTimer({ clickTimer: this.control.clickTimer = false })
    );
    this.broadcastScreens();
  }

  toggleQuestion() {
    clearInterval(this.interval);
    this.audio.pause();
    this.count10sec.pause();
    this.count5sec.pause();

    this.store.dispatch(updateShowQuestion());
    this.store.dispatch(
      updateClickTimer({ clickTimer: this.control.clickTimer = false })
    );

    // update control extraWord if show question false when round 5
    if (!this.control.showQuestion) {
      _.map(this.control.extraWord, obj => {
        obj.visible = false;
      });
    }
    this.broadcastScreens();
  }

  startTimer(isStart) {
    //showQuestion automatically in round 4
    let timer = this.timeOut;
    if (this.currentRound.hasCategory) {
      this.control.showQuestion = true;
      this.isStartRound4 = true;
      console.log('is start => ', isStart)
    }

    this.store.dispatch(updateStartCount({ control: this.control }));
    this.store.dispatch(
      updateClickTimer({ clickTimer: this.control.clickTimer = true })
    );
    // round 5 animation
    this.store.dispatch(animatedExtraWord({ animationExtraWord: "" }));
    this.broadcastScreens();

    if (this.control.startCount == TimerEnum.START && isStart) {
      //only play the beep sound timer is above 5
      if (timer == 5) {
        this.count5sec.play();
      } else if (timer == 10) {
        if (this.timeOut > 5) this.audio.play();
      } else if (timer == 30 || timer == 15) {
        if (this.timeOut > 10) this.audio.play();
      }

      this.interval = setInterval(() => {
        if (this.timeOut <= 0) {
          //disable start timer button
          this.disableStart = true;

          clearInterval(this.interval);

          this.store.dispatch(updateStartCount({ control: this.control }));
          if(this.currentRound.questionType == 5 && this.control.isPlay) {
            this.control.isPlay = false
            this.isPlay = false;
          }
          this.broadcastScreens();

          //show CorrectAnswer count for round 4 after timeout
          if (this.currentRound.hasCategory) {
            console.log("round 4 end");
            //show corrected count
            this.correctAnswerCount = _.filter(
              this.questionArraysByCategory[this.currentCategory.id],
              question => question.actions == 1
            ).length;

            this.finishCategoryRound = true;

            this.store.dispatch(endCategoryRound());
            this.broadcastScreens();

            this.runCategoryRound = false;
          }
        } else {
          this.timeOut = this.timeOut - 1;
          if (timer == 5) {
            this.count5sec.play();
          } else if (timer == 10) {
            if (this.timeOut < 6) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.count5sec.play();
            }
          } else if (timer == 30 || timer == 15) {
            if (this.timeOut < 13) {
              this.audio.pause();
              this.audio.currentTime = 0;
              this.count10sec.play();
            }
          }
        }
      }, 1000);
    } else {
      clearInterval(this.interval);

      this.audio.pause();
      this.count10sec.pause();
      this.count5sec.pause();
    }
  }

  correctAnswer() {
    // play audio if press Correct Answer button


    console.log('this.currentQustion answer => ', this.currentQuestion.ans, this.roundFourHintValue)

    this.runCategoryRound = true;
    this.store.dispatch(runCategoryRound());

    //showAnswer
    this.store.dispatch(ShowAnsForCategoryRound());
    if (this.currentRound.questionType == 4 && _.find(this.control.roundFourStatus, ['imagePath', './assets/images/yellow_rectangle.png']) !== undefined) {
      if (this.roundFourHintValue == this.currentQuestion.ans) {
        _.find(this.control.roundFourStatus, ['imagePath', './assets/images/yellow_rectangle.png']).imagePath = './assets/images/green_rectangle.png'
        //mark correct answer in separted arrays
        _.find(this.questionArraysByCategory[this.currentCategory.id], [
          "id",
          this.currentQuestion.id
        ]).actions = 1;

      } else {
        if (this.currentRound.questionType == 4 && _.find(this.control.roundFourStatus, ['imagePath', './assets/images/yellow_rectangle.png']) !== undefined) {
          _.find(this.control.roundFourStatus, ['imagePath', './assets/images/yellow_rectangle.png']).imagePath = './assets/images/red_rectangle.png'
        }
        _.find(this.questionArraysByCategory[this.currentCategory.id], [
          "id",
          this.currentQuestion.id
        ]).actions = 4;
      }
    }
    this.correct_answer_audio.play();
    this.correctAnswerCount = _.filter(
      this.questionArraysByCategory[this.currentCategory.id],
      question => question.actions == 1
    ).length;

    if (this.currentRound.questionType == 4 && this.questionDropDownByCategory()[this.questionDropDownByCategory().length - 1] == this.currentQuestion) {
      setTimeout(() => {
        // clearInterval(this.interval);
        this.startTimer(false);
        this.finishCategoryRound = true;
        this.store.dispatch(endCategoryRound());
        this.runCategoryRound = false;
      }, 2000);
    }
    this.broadcastScreens();

    // // //checkLastIndex or not
    // let checkLastIndex = false;
    // if (
    //   this.currentQuestion.id ==
    //   _.last(this.questionArraysByCategory[this.currentCategory.id]).id ||
    //   this.checkLastIndexExcludeSkip()
    // )
    //   checkLastIndex = true;

    // if (this.control.showAns) this.correctAnswerDisable = true;
    // //after 1s check end of arrays by category
    // setTimeout(() => {
    //   //check loopQuestion or not ( if loop again, it will not nextQuestion, it has to jump to skip one)
    //   if (this.loopQuestion || checkLastIndex) {
    //     //search skip question when in loop condition or lastIndex
    //     this.searchSkipQuestion(checkLastIndex);

    //     this.loopQuestion = true;
    //   } else {
    //     // show next question
    //     // const nextQuest = this.nextQuestionByCategoryId();
    //     // this.clickQuestion(nextQuest, this.currentQuestionIndex + 1);
    //   }
    // }, 1000);

    // setTimeout(() => {
    //   this.correctAnswerDisable = false;
    // }, 1500);
  }

  nextQuestionByCategoryId() {
    let currentQuestion = this.currentQuestion;
    let nextQuestion = this.currentQuestion;
    do {
      if (currentQuestion.id != this.currentRound.questionArray.length) {
        nextQuestion = _.find(this.currentRound.questionArray, [
          "id",
          currentQuestion.id + 1
        ]);
        currentQuestion = nextQuestion;
      } else break;
    } while (nextQuestion.categoryId != this.currentCategory.id);

    return nextQuestion;
  }

  checkLastIndexExcludeSkip() {
    //search skip by index ++ from currentId
    let arr = this.questionArraysByCategory[this.currentCategory.id];
    let index = _.findIndex(arr, {
      id: this.currentQuestion.id
    });

    let i;
    for (i = index + 1; i < arr.length; i++) {
      if (arr[i].actions == 3 || arr[i].actions == 0) {
        return false;
      }
    }
    return true;
  }

  searchSkipQuestion(checkLastIndex) {
    let skipQuestion;

    if (checkLastIndex) {
      //search first skip in array
      skipQuestion = _.find(
        this.questionArraysByCategory[this.currentCategory.id],
        ["actions", 3]
      );
    } else {
      //search skip by index ++ from currentId
      let arr = this.questionArraysByCategory[this.currentCategory.id];
      let index = _.findIndex(arr, {
        id: this.currentQuestion.id
      });

      let i;
      for (i = index + 1; i < arr.length; i++) {
        if (arr[i].actions == 3) {
          skipQuestion = arr[i];
          break;
        }
      }
    }

    //check still exist skip Questions
    if (skipQuestion) {
      //search index number to show
      const index = _.findIndex(
        this.questionArraysByCategory[this.currentCategory.id],
        {
          id: skipQuestion.id
        }
      );

      this.clickQuestion(skipQuestion, index + 1);
    } else {
      console.log("round 4 end");
      //end of round 4 ,stop timer
      this.startTimer(false);

      //show corrected count
      this.correctAnswerCount = _.filter(
        this.questionArraysByCategory[this.currentCategory.id],
        question => question.actions == 1
      ).length;

      this.finishCategoryRound = true;

      this.store.dispatch(endCategoryRound());
      this.broadcastScreens();

      this.runCategoryRound = false;
    }
  }

  wrongOrskipQuestion(action) {
    this.runCategoryRound = true;
    this.store.dispatch(runCategoryRound());
    console.log('before action => ', _.find(this.questionArraysByCategory[this.currentCategory.id], [
      "id",
      this.currentQuestion.id
    ]).actions)
    //mark skip answer in separted arrays
    if (_.find(this.questionArraysByCategory[this.currentCategory.id], [
      "id",
      this.currentQuestion.id
    ]).actions == 0) {
      _.find(this.questionArraysByCategory[this.currentCategory.id], [
        "id",
        this.currentQuestion.id
      ]).actions = action;
    }

    console.log('after action => ', _.find(this.questionArraysByCategory[this.currentCategory.id], [
      "id",
      this.currentQuestion.id
    ]).actions)
    //checkLastIndex or not
    let checkLastIndex = false;

    if (
      this.currentQuestion.id ==
      _.last(this.questionArraysByCategory[this.currentCategory.id]).id ||
      this.checkLastIndexExcludeSkip()
    )
      checkLastIndex = true;

    //check end of arrays by category
    if (this.loopQuestion || checkLastIndex) {
      //check exit skip question
      this.searchSkipQuestion(checkLastIndex);

      this.loopQuestion = true;
    } else {
      //show next question
      const nextQuest = this.nextQuestionByCategoryId();

      this.clickQuestion(nextQuest, this.currentQuestionIndex + 1);
    }
  }

  increasePoint(playerId) {
    this.episode.players.map(player => {
      if (player.id == playerId) player.point += this.currentPoint
    });

    this.store.dispatch(updateEpisodeStore({ episode: this.episode }));
    // round 5 each extrqWord animation
    this.store.dispatch(animatedExtraWord({ animationExtraWord: "" }));

    // for blocking text animation
    this.store.dispatch(
      updateClickPoint({ clickPoint: this.control.clickPoint })
    );
    this.broadcastScreens();
  }

  decreasePoint(playerId) {
    this.episode.players.map(player => {
      if (player.id == playerId) {
        player.point -= this.currentPoint;
        if (player.point < 0) player.point = 0;
      }
    });

    this.store.dispatch(updateEpisodeStore({ episode: this.episode }));
    // round 5 each extrqWord animation
    this.store.dispatch(animatedExtraWord({ animationExtraWord: "" }));
    // for blocking text animation
    this.store.dispatch(
      updateClickPoint({ clickPoint: this.control.clickPoint })
    );
    this.broadcastScreens();
  }

  changePlayerName(event, playerId) {
    this.episode.players.map(player => {
      if (player.id == playerId) player.name = event.target.value;
    });
    this.broadcastScreens();
  }

  clickExtra(extraWord) {
    if (this.control.showQuestion) {
      _.map(this.control.extraWord, obj => {
        if (obj.word == extraWord.word) {
          if (obj.visible) obj.visible = false;
          else obj.visible = true;
        }
      });
    }
    this.updateKeyExtra(extraWord.word);
  }

  updateKeyExtra(word?) {
    this.store.dispatch(updateExraWord({ extraWord: this.control.extraWord }));
    this.store.dispatch(animatedExtraWord({ animationExtraWord: word }));
    this.broadcastScreens();
  }
  resetExtraKey() {
    _.map(this.control.extraWord, obj => {
      obj.visible = false;
    });
    console.log("extraWord >> ", this.control.extraWord);
    this.updateKeyExtra();
  }

  // font setting
  setting(content_control_setting) {
    console.log('current round => ', this.currentRound)
    console.log('current question => ', this.currentQuestion)
    this.oldCurrentRound = _.cloneDeep(this.currentRound)
    this.oldCurrentPlayer = _.cloneDeep(this.episode.players)
    // animation control when change font
    this.control.fontSettingOpenClose = true;

    // if open setting, stop timer
    if (this.control.startCount == TimerEnum.START) this.startTimer(true);

    // keep first fontSettings
    this.resetFontValue = _.cloneDeep(this.control.fontSettings);

    // close all child windows ,save and navigate back
    this.modalService
      .open(content_control_setting, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "xl",
        backdrop: "static",
        keyboard: false
      })
      .result.then(
        result => {
          this.isfontEmpty();
          // this.saveFont();
        },
        reason => {
          console.log("reason >> ", reason);
          if (reason == "Reset click") {
            let defaultFontValue = {
              main_roundName: 45,
              main_clue: 45,
              main_hint: 47,
              main_answer: 47,
              main_timeOut: 50,
              oneThird_timeOut: 25,
              oneThird_hint: 35,
              oneThird_answer: 35,
              player_point: 134,
              externalDeviceSetting: {
                websocketUrl: "ws://localhost:8081/ws/websocket"
              },
              screenPropertytSetting: {
                spinnerWheelDuration: 10
              }
            };

            this.control.fontSettings = defaultFontValue;
            this.wordWhiz.fontSettings = defaultFontValue;

            this.saveFont();
            saveFile(this.wordWhiz, () => { });
          } else if (reason == "Cancel click") {
            this.control.fontSettings = this.resetFontValue;
            this.wordWhiz.fontSettings = this.resetFontValue;
            this.saveFont();
            this.currentRound = this.oldCurrentRound
            this.episode.players = this.oldCurrentPlayer
            this.broadcastScreens()
          } else if (reason == "Cross click") {
            this.control.fontSettings = this.resetFontValue;
            this.wordWhiz.fontSettings = this.resetFontValue;
            this.saveFont();
          } else if (reason == 'Save click') {
            console.log('save click')
          }
        }
      );
  }

  saveFont() {
    this.broadcastScreens();

    // animation stop when font setting change
    this.control.fontSettingOpenClose = false;
    //for reload state in development
    localStorage.setItem("control", JSON.stringify(this.control));
  }

  // changeFontSetting(id, val) {
  //   this.control.fontSettings[id] = val;
  //   //this.broadcastScreens();
  // }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  increaseFontSize(id) {
    this.control.fontSettings[id] += 1;
    this.broadcastScreens();
  }

  decreaseFontSize(id) {
    this.control.fontSettings[id] -= 1;
    if (this.control.fontSettings[id] < 0) {
      this.control.fontSettings[id] = 0;
    }
    this.broadcastScreens();
  }

  wrongAnswer() {
    // play audio if press Wrong Answer button
    this.wrong_answer_audio.play();
  }

  isfontEmpty() {
    const {
      main_roundName,
      main_clue,
      main_hint,
      main_answer,
      main_timeOut,
      oneThird_timeOut,
      oneThird_hint,
      oneThird_answer,
      player_point
    } = this.control.fontSettings;

    if (!main_answer) this.control.fontSettings.main_answer = 0;
    if (!main_clue) this.control.fontSettings.main_clue = 0;
    if (!main_hint) this.control.fontSettings.main_hint = 0;
    if (!main_roundName) this.control.fontSettings.main_roundName = 0;
    if (!main_timeOut) this.control.fontSettings.main_timeOut = 0;
    if (!oneThird_answer) this.control.fontSettings.oneThird_answer = 0;
    if (!oneThird_hint) this.control.fontSettings.oneThird_hint = 0;
    if (!oneThird_timeOut) this.control.fontSettings.oneThird_timeOut = 0;
    if (!player_point) this.control.fontSettings.player_point = 0;
  }

  applyFontSize() {
    console.log('current round =>>> ', this.currentRound)
    this.broadcastScreens();
  }

  changePlayerPointSize(pointFontSize) {
    this.episode.players.map(player => player.pointFontSize = pointFontSize)
  }

  radioOnChange(event, hintValue) {
    this.roundFourHintValue = hintValue
    let radioValue = event.target.value
    switch (radioValue) {
      case '1default':
        _.find(this.control.roundFourStatus, ['id', 1]).imagePath = './assets/images/blue_rectangle.png';
        break;
      case '2default':
        _.find(this.control.roundFourStatus, ['id', 2]).imagePath = './assets/images/blue_rectangle.png';
        break;
      case '3default':
        _.find(this.control.roundFourStatus, ['id', 3]).imagePath = './assets/images/blue_rectangle.png';
        break;
      case '1choose':
        _.find(this.control.roundFourStatus, ['id', 1]).imagePath = './assets/images/yellow_rectangle.png';
        break;
      case '2choose':
        _.find(this.control.roundFourStatus, ['id', 2]).imagePath = './assets/images/yellow_rectangle.png';
        break;
      case '3choose':
        _.find(this.control.roundFourStatus, ['id', 3]).imagePath = './assets/images/yellow_rectangle.png';
        break;
      default:
        break;
    }
    this.runCategoryRound = true;
    this.store.dispatch(runCategoryRound());
    this.broadcastScreens();
  }

  setDefaultRadioState() {
    setTimeout(() => {
      (<HTMLInputElement>document.querySelector('input[value="1default"]')).checked = true;
      (<HTMLInputElement>document.querySelector('input[value="2default"]')).checked = true;
      (<HTMLInputElement>document.querySelector('input[value="3default"]')).checked = true;
    }, 0);
  }

  changePlayerBgImage() {
    this.control.isChangePlayerBgImage = !this.control.isChangePlayerBgImage;
    this.store.dispatch(updatePlayerScreenBackground({ isChangePlayerBgImage: this.control.isChangePlayerBgImage }));
    this.broadcastScreens();
  }

  toggleVideo() {
    this.isPlay = !this.isPlay
    this.control.startCount = TimerEnum.NEUTRAL
    this.control.isPlay = this.isPlay
    this.broadcastScreens();
  }

  changeR4Category(category) {
    this.r4CategoryName = category.name
    this.r4CategoryId = category.id
    this.questionArrForR4()
    let firstQuestionByCategoryId = _.find(this.currentRound.questionArray, [
      "categoryId",
      category.id
    ]);
    this.clickQuestion(firstQuestionByCategoryId, 1)
  }

  changeCurrentPoint(timeOut: number) {
    // update point for round Two
    if (this.currentRound.questionType == 6) {
      if (timeOut == 10) {
        this.currentPoint = this.currentRound.point
      } else if (timeOut == 5) {
        this.currentPoint = this.currentRound.secondPoint
      }
    }
    // update point for round Three
    if (this.currentRound.questionType == 2) {
      if (timeOut == 10) {
        this.currentPoint = this.currentRound.point
      } else if (timeOut == 5) {
        this.currentPoint = this.currentRound.secondPoint
      }
    }
    // update point for round one
    if (this.currentRound.questionType == 1) {
      if (timeOut == 10) {
        this.currentPoint = this.currentRound.point
      } else if (timeOut == 5) {
        this.currentPoint = this.currentRound.secondPoint
      }
    }
    // update point for round one
    if (this.currentRound.questionType == 8) {
      if (timeOut == 10) {
        this.currentPoint = this.currentRound.point
      } else if (timeOut == 5) {
        this.currentPoint = this.currentRound.secondPoint
      }
    }
  }

  toggleWebSocketConnection(): void {
    this.externalDevice.wordWhizIsConnected ? this.disconnect() :
      this.initWebSocketConnection(this.control.fontSettings.externalDeviceSetting.websocketUrl);
  }

  updatePlayerActiveStatus(): void {
    this.episode.players.forEach((player: Player) => {
      let name = `player${player.id}`;
      let doc = document.getElementById(name)
      if (doc) {
        if (this.externalDevice.onlineUsers.has(name)) {
          document.getElementById(name).className = 'active-player';
        } else {
          document.getElementById(name).classList.remove('active-player')
        }
      }
    })
  }

  openSpinnerWheelScreen(): void {
    this.newWindow(14);
  }

  selectSpinnerWheelNumber(spinnerWheelNo: number): void {
    console.log('spinnerWheelNo: ', spinnerWheelNo)
    this.spinnerWheelNo = spinnerWheelNo;
    this.control.extraWord.map(extraword => extraword.visible = false) // reset true value to false
    this.control.extraWord[spinnerWheelNo].visible = true;
    this.broadcastScreens();
  }

  toggleSpinnerWheel(): void {
    let spinnerWheel = {
      isSpinningWheel: this.isSpinningWheel,
    }
    this.newWindows.forEach(w => {
      w.webContents.send("spin_the_wheel", spinnerWheel);
    });
  }

  selectPlayer(playerId: string): void {
    this.externalDevPlayerId = playerId
    this.control.currentPlayerId = `player${playerId}`
  }

  toggleQuestionForTablet(){
    this.showQuestionInTablet = !this.showQuestionInTablet;
    if (this.showQuestionInTablet) {
      this.sendQuestionToExternalDevice('specific-player', this.control.currentRoundId);
    } else {
      this.sendQuestionToExternalDevice('specific-player', 0);
    }
  }
}
