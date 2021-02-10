import { Hint } from './../../core/models/hint';
import { Component, OnInit, NgZone } from "@angular/core";
import * as $ from "jquery";
import { Store, select } from "@ngrx/store";
import { Observable, timer } from "rxjs";
import { updateStoreFromControl } from "../../core/actions/control.actions";
import { Images } from "../../common/images";
import { take, map } from "rxjs/operators";
import { Control } from "../../core/models/control";
import { Episode } from "../../core/models/episode";
import { WordWhiz } from "../../core/models/wordWhiz";
import { Round } from "../../core/models/round";
import { Question } from "../../core/models/question";
import * as _ from "lodash";
import { readFile, readFileSync } from "fs";
import parseAPNG from "apng-js";
import { AppConfig } from "../../../environments/environment";
import { convertUpdateArguments } from "@angular/compiler/src/compiler_util/expression_converter";
import { TimerEnum } from '../../core/models/timerEnum';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {
  control: Control;
  episode: Episode;
  Images = Images;
  currentRound: Round;
  currentQuestion: Question;

  interval;
  counter$: number;

  isStopped = false;
  prevCurrentQustion;
  prevCurrentRound;

  ansCharArr = [];
  blockAnimated: boolean = false;
  hints : string = "";
  renderingAPNG = false;
  isRenderedTimer = false;

  categoryName = "";
  player = null;
  log = [];
  round4hintAnimated = true;
  timeoutList: any;
  cubeImageEle: any
  rFourCubeImageEle: any
  rFourCubeImage = new Image();
  prevCategoryId: number
  cubeImage = new Image();

  constructor(
    private store: Store<{
      episode: Episode;
      control: Control;
    }>,
    readonly nz: NgZone
  ) {
    const ipc = require("electron").ipcRenderer;

    ipc.on("word_whizControl", (event, message) => {
      console.log("incoming broadcast event from control", message);

      //update store
      this.store.dispatch(updateStoreFromControl({ control: message }));
      //to render the view
      this.nz.run(() => {
        this.control = message.control;
        this.episode = message.episode;
        this.updateMainBoardState();
      });
    });
  }

  get timerEnum(): typeof TimerEnum {return TimerEnum}

  ngOnInit() {

    this.renderingAPNG = true;

    this.readAllTimerFiles();

    //read for mainBG and cube
    const image = document.getElementById("main_background");
    this.cubeImageEle = document.images.namedItem("cube_img");
    this.rFourCubeImageEle = document.images.namedItem("r4_cube_img");

    const mainBgImage = new Image();

    mainBgImage.onload = () => {
      image.style.background = "url(" + mainBgImage.src + ")";
      image.style.backgroundSize = "cover";

      this.renderingAPNG = false;
      this.nz.run(() => { });
    };
    this.cubeImage.onload = () => {
      this.cubeImageEle.src = this.cubeImage.src;
    };

    this.rFourCubeImage.onload = () => {
      this.rFourCubeImageEle.src = '';
    };

    if (AppConfig.production) {
      mainBgImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/main_background.png";
      this.cubeImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/cube.png";
      this.rFourCubeImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/cube.png";
    } else {
      mainBgImage.src = "../../../assets/images/temp/main_background.png";
      this.cubeImage.src = "../../../assets/images/temp/cube.png";
      this.rFourCubeImage.src = "../../../assets/images/temp/cube.png";
    }

    this.store.subscribe(item => {
      this.control = item.control;
      this.episode = item.episode;
    });
  }

  readAllTimerFiles() {
    console.log("READING COUNTDOWN IMAGE");

    //get episodetimeout
    if (AppConfig.production) {
      this.readFileProduction();
    } else {
      this.readFileDev();
    }

    _.map(this.timeoutList, (time, i) => {
      let filePath = "";

      let timeOutFileName = time.fileName;
      console.log('timeOutFileName => ', timeOutFileName)
      if (AppConfig.production)
        filePath =
          process.env.PORTABLE_EXECUTABLE_DIR +
          "/data/images/timer/" +
          timeOutFileName +
          ".png";
      else {
        filePath =
          process.cwd() +
          "/release/data/images/timer/" +
          timeOutFileName +
          ".png";
      }

      //read for animated timer
      readFile(filePath, (err, data) => {
        if (err) throw err;
        let parsedData = parseAPNG(data);
        time.data = parsedData;
        if (time.data instanceof Error) {
          return;
        }

        parsedData.createImages().then(() => {
          console.log("CREATED ALL ");
          if (i == this.timeoutList.length - 1) {
            this.renderingAPNG = false;
            console.log("data", this.timeoutList);

            //initial show the image by current round
            this.renderTimerImage(true);
            this.isRenderedTimer = true;
          }
        });
      });
    });
  }

  renderTimerImage(initial) {
    console.log("RENDERING COUNTDOWN IMAGE");
    //check read image is finish
    if (!this.renderingAPNG) {
      let currentTimeData = _.result(
        _.find(this.timeoutList, ["value", this.currentRound.timeOut]),
        "data"
      );

      if (!initial) this.renderingAPNG = true;

      currentTimeData.createImages().then(() => {
        console.log("CREATED");
        let canvas;
        if (initial) canvas = document.createElement("canvas");
        else canvas = document.querySelector("canvas");
        canvas.width = currentTimeData.width;
        canvas.height = currentTimeData.height;
        canvas.style.width = "100%";
        canvas.style.maxWidth = "105% !important";
        canvas.style.height = "auto";
        /*  canvas.style.marginTop = "11px"; */
        const canvasDiv = document.querySelector(".apng-ani");
        if (initial) canvasDiv.appendChild(canvas);

        currentTimeData.getPlayer(canvas.getContext("2d")).then(p => {
          if (!initial) {
            this.player = null;
            this.log = [];
            this.renderingAPNG = false;
            this.nz.run(() => { });
          }
          this.player = p;
          // player.playbackRate = playbackRate;
          this.player.playbackRate = 2.5;
          const em = this.player.emit;
          this.player.emit = (event, ...args) => {
            this.log.unshift({ event, args });
            if (this.log.length > 10) {
              this.log.splice(10, this.log.length - 10);
            }
            em.call(this.player, event, ...args);
          };
        });
      });
    }
  }

  updateMainBoardState() {
    //update current round
    this.currentRound = _.find(this.episode.rounds, [
      "id",
      this.control.currentRoundId
    ]);

    //update timer image when changing round except initial state
    if (this.isRenderedTimer) {
      if (this.prevCurrentRound != this.control.currentRoundId) {
        this.renderTimerImage(false);
      }
    }

    //update current question
    this.currentQuestion = _.find(this.currentRound.questionArray, [
      "id",
      this.control.currentQuestionId
    ]);

    if (this.currentRound.questionType == 2) {
      this.cubeImageEle.src = ''
      this.rFourCubeImageEle.src = ''
    } else if (this.currentRound.questionType == 4) {
      this.cubeImageEle.src = ''
      this.rFourCubeImageEle.src = this.rFourCubeImage.src
    }else if(this.currentRound.questionType == 5){
      this.cubeImageEle.src = ''
      this.rFourCubeImageEle.src = ''
    }else if(this.currentRound.questionType == 7){
      this.cubeImageEle.src = ''
      this.rFourCubeImageEle.src = ''
    }
    else {
      this.cubeImageEle.src = this.cubeImage.src;
      this.rFourCubeImageEle.src = ''
    }

    console.log('current question => ', this.currentQuestion)
    console.log('current round => ', this.currentRound)
    //update timer count value
    if (this.currentRound.hasCategory) {
      //update only in selecting theme for round 4
      if (
        !this.control.runCategoryRound &&
        !this.control.finishCategoryRound &&
        !this.control.showQuestion
      ) {
        this.counter$ = this.currentRound.timeOut;
        if (this.player) this.player.stop();

        //reset when initialize
        this.isStopped = false;
      }

      //category Name for round 4
      this.categoryName = _.result(
        _.find(this.currentRound.categories, [
          "id",
          this.currentQuestion.categoryId
        ]),
        "name"
      );

      //check for hint animation for round 4 when changing ques
      if (this.prevCurrentQustion != this.control.currentQuestionId) {
        this.round4hintAnimated = true;
      }
    } else {
      //update when change ques and change round
      if (
        this.prevCurrentQustion != this.control.currentQuestionId ||
        this.prevCurrentRound != this.control.currentRoundId
      ) {
        this.counter$ = this.currentRound.timeOut;
        if (this.player) this.player.stop();

        this.blockAnimated = false;
      }

      if (this.control.showQuestion && this.currentRound.questionType == 2) {
        if (this.prevCategoryId == undefined) this.prevCategoryId = this.currentQuestion.categoryId
        else if (this.prevCategoryId !== this.currentQuestion.categoryId) {
          this.prevCategoryId = this.currentQuestion.categoryId
        }
        console.log('current question index => ', this.currentQuestion.categoryId)
        this.setGridValue();
        if (this.control.showAns) {
          this.showGridEachAnswer();
        } else {
          this.hideGridEachAnswer();
        }
      }
    }

    if (this.counter$ == undefined || this.control.resetCount) {
      this.counter$ = this.currentRound.timeOut;
      if (this.player) this.player.stop();
    }

    // check for hint animation for round 4 when changing ques
    if (this.control.showAns) this.round4hintAnimated = false;

    this.prevCurrentRound = this.currentRound.id;
    this.prevCurrentQustion = this.currentQuestion.id;

    // check count down
    if (this.control.runCategoryRound) {
      //click stop after start in round 4
      if (this.control.startCount == TimerEnum.STOP) {
        clearInterval(this.interval);
        this.isStopped = true;

        if (this.player) {
          this.player.pause();
        }
      } else {
        if (this.isStopped) {
          //restart count down again after stop in round 4
          this.countDown();
          this.player.play();
          this.isStopped = false;
        }
      }
    } else {
      //normal round and round 4 first start
      if (
        this.control.startCount == TimerEnum.START &&
        !this.control.clickExtraKey &&
        !this.control.resetCount
      ) {
        this.countDown();
        this.player.play();
      }
      if (this.control.startCount == TimerEnum.STOP) {
        clearInterval(this.interval);
        if (this.player) {
          this.player.pause();
        }
      }
      //else do nothing
    }

    //separate character Answer
    if (this.currentQuestion.isAnsCharacter) {
      this.ansCharArr = this.currentQuestion.ans.split("");
    }

    //Implemented by ZBH
    if(this.currentRound.questionType == 1 && this.currentQuestion.hints.length){
        this.hints = "";
        this.currentQuestion.hints.forEach(hint => {
          this.hints += (hint.value);
        });
      console.log("Controls => ", this.control);
    }
    //Implemented by ZBH

    //separate character hints
    _.map(this.currentQuestion.hints, hint => {
      if (hint.isCharacter) hint.hintCharArr = hint.value.split("");
    });

    //animation
    if (
      this.control.startCount == TimerEnum.START ||
      this.control.showAns ||
      this.control.clickExtraKey
    ) {
      this.blockAnimated = true;
    }
    // animation
    if (
      this.control.startCount == TimerEnum.STOP &&
      !this.control.showAns &&
      !this.control.showQuestion
    )
      this.blockAnimated = false;
  }

  countDown() {
    this.interval = setInterval(() => {
      //stop the animated timer when last frame
      if (this.player.ended) this.player.pause();

      if (this.counter$ <= 0) {
        clearInterval(this.interval);
      } else {
        this.counter$ = this.counter$ - 1;
      }
    }, 1000);
  }

  readFileDev() {
    const filePath =
      process.cwd() + "/release/data/images/timer/timerInfo.json";

    const data = readFileSync(filePath, "utf8");
    this.timeoutList = JSON.parse(data);
  }

  readFileProduction() {
    const filePath =
      process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/timer/timerInfo.json";

    const data = readFileSync(filePath, "utf8");
    this.timeoutList = JSON.parse(data);
  }

  setGridValue() {
    console.log('called setGridValue function()')
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      // console.log('id: ', id, ', ans: ', question.ans)
      if (this.currentQuestion.ans.includes(id)) {
        setTimeout(() => {
          // (<HTMLDivElement>document.getElementById(id)).innerText = this.currentQuestion.hints[0].value.charAt(index);
          (<HTMLDivElement>document.getElementById(id)).style.background =
            `url(./assets/images/BLUE/${this.currentQuestion.hints[0].value.charAt(index).toUpperCase()}.png) no-repeat`
        }, 0);
      } else if ((<HTMLDivElement>document.getElementById(id)) !== null) {
        if ((<HTMLDivElement>document.getElementById(id)).style.background == '') {
          setTimeout(() => {
            console.log('value => ', (<HTMLDivElement>document.getElementById(id)).style.background);
            (<HTMLDivElement>document.getElementById(id)).style.background = 'url(./assets/images/GREEN/blank.png) no-repeat';
          }, 0);
        }

      }
    })

  }

  showGridEachAnswer() {
    console.log('called showGridEachAnswer function()')
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      setTimeout(() => {
        (<HTMLDivElement>document.getElementById(id)).style.background =
          `url(./assets/images/GREEN/${this.currentQuestion.hints[0].value.charAt(index).toUpperCase()}.png) no-repeat`
        // this.currentQuestion.hints[0].value.charAt(index);
        // (<HTMLDivElement>document.getElementById(id)).style.background = 'url(./assets/images/grid-correct-bg.png) no-repeat';
      }, 0);
    })
  }

  hideGridEachAnswer() {
    console.log('called hideGridEachAnswer function()')
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      if (this.currentQuestion.ans.includes(id) && (<HTMLDivElement>document.getElementById(id)) !== null) {
        console.log('id => ', id);
        (<HTMLDivElement>document.getElementById(id)).style.background =
          `url(./assets/images/BLUE/${this.currentQuestion.hints[0].value.charAt(index).toUpperCase()}.png) no-repeat`
      } else {
        setTimeout(() => {
          if ((<HTMLDivElement>document.getElementById(id)).style.background == '') {
            (<HTMLDivElement>document.getElementById(id)).style.background = 'url(./assets/images/GREEN/blank.png) no-repeat'
          }
        }, 0);

      }
    })
  }
}
