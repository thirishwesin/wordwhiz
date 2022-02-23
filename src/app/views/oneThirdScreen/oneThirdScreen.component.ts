import { Component, OnInit, NgZone } from "@angular/core";
import { Images } from "../../common/images";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Episode } from "../../core/models/episode";
import { Control } from "../../core/models/control";
import { updateStoreFromControl } from "../../core/actions/control.actions";
import { Round } from "../../core/models/round";
import { Question } from "../../core/models/question";
import * as _ from "lodash";
import { readFile, readFileSync } from "fs";
import parseAPNG from "apng-js";
import { AppConfig } from "../../../environments/environment";
import { TimerEnum } from "../../core/models/timerEnum";
import { ScreenType } from "../../core/models/screenType";

@Component({
  selector: "app-oneThird",
  templateUrl: "./oneThirdScreen.component.html",
  styleUrls: ["./oneThirdScreen.component.scss"]
})
export class OneThirdScreenComponent implements OnInit {
  Images = Images;

  control: Control;
  episode: Episode;

  currentRound: Round;
  currentQuestion: Question;

  interval;
  counter: number;
  isStopped: boolean = false;
  prevCurrentQustionId;
  prevCurrentRound;

  ansCharArr = [];

  blockAnimated: boolean = false;
  renderingAPNG = false;
  isRenderedTimer = false;

  categoryName = "";
  player = null;
  log = [];
  round4hintAnimated = true;
  timeoutList: any;
  cubeImage = new Image();
  cube_image: any
  prevCategoryId: number
  image: any
  oneThirdBgImage = new Image();
  roundTowBgImage = new Image();
  roundTwoBgImageEle: any;
  hints: string = "";
  prevRoundId: number
  oneThirdScreen: ScreenType = ScreenType.ONETHIRD
  previousQuestionId: number = undefined

  constructor(
    private router: Router,
    private store: Store<{ episode: Episode; control: Control }>,
    readonly nz: NgZone
  ) {
    const ipc = require("electron").ipcRenderer;
    ipc.on("word_whizControl", (event, data) => {
      console.log("one third data > > ", data);

      // update store
      this.store.dispatch(updateStoreFromControl(data));

      this.nz.run(() => {
        this.episode = data.episode;
        this.control = data.control;
        this.getData();
      });
    });
  }

  get timerEnum(): typeof TimerEnum {return TimerEnum}

  ngOnInit() {
    this.renderingAPNG = true;

    this.readAllTimerFiles();

    //read for mainBG and cube
    this.cube_image = document.images.namedItem("cube_img");
    this.image = document.getElementById("header");
    this.roundTwoBgImageEle = document.getElementById("round_two_bg")

    this.oneThirdBgImage.onload = () => {
      this.image.style.background = "url(" + this.oneThirdBgImage.src + ")";
      this.image.style.backgroundSize = "cover";

      // this.renderingAPNG = false;
      this.nz.run(() => { });
    };
    this.cubeImage.onload = () => {
      this.cube_image.src = this.cubeImage.src;
    };

    this.roundTowBgImage.onload = () => {
      this.roundTwoBgImageEle.style.background = ""
    }

    if (AppConfig.production) {
      this.oneThirdBgImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/one_third_header.PNG";
      this.cubeImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/cube.png";
      this.roundTowBgImage.src = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/one-third-round-2.png";

    } else {
      this.oneThirdBgImage.src = "../../../assets/images/temp/one_third_header.PNG";
      this.cubeImage.src = "../../../assets/images/temp/cube.png";
      this.roundTowBgImage.src = "../../../assets/images/temp/one-third-round-2.png";
    }

    this.store.subscribe(item => {
      this.control = item.control;
      this.episode = item.episode;
    });

    //set background black
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("color-theme");
  }

  readAllTimerFiles() {
    console.log("READING COUNTDOWN IMAGE");

    //get episodetimeout
    if (AppConfig.production) {
      this.readFileProduction();
    } else {
      this.readFileDev();
    }
    let count = 0;
    _.map(this.timeoutList, (time, i) => {
      let filePath = "";

      let timeOutFileName = time.fileName;

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
          if (count == this.timeoutList.length - 1) {
            this.renderingAPNG = false;
            console.log("data", this.timeoutList);

            //initial show the image by current round
            this.renderTimerImage(true, this.currentRound.timeOut);
            this.isRenderedTimer = true;
          }else count += 1;
        });
      });
    });
  }

  renderTimerImage(initial, timeout: number) {
    console.log("RENDERING COUNTDOWN IMAGE");
    //check read image is finish

    let currentTimeData = _.result(
      _.find(this.timeoutList, ["value", timeout]),
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
      // canvas.style.height = "auto";
      /*  canvas.style.marginTop = "11px"; */
      const canvasDiv = document.querySelector(".apng-ani");
      if (initial) canvasDiv.appendChild(canvas);

      currentTimeData.getPlayer(canvas.getContext("2d")).then(p => {
        if (!initial) {
          this.player = null;
          this.log = [];
        }

        this.renderingAPNG = false;
        this.nz.run(() => { });

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

  getData() {
    if(this.prevRoundId == undefined) this.prevRoundId = this.control.currentRoundId;
    if(this.prevRoundId != this.control.currentRoundId) this.previousQuestionId = undefined
    //update current round
    this.currentRound = _.find(this.episode.rounds, [
      "id",
      this.control.currentRoundId
    ]);

    //update timer image when changing round except initial state
    if (this.isRenderedTimer) {
      if (this.prevCurrentRound != this.control.currentRoundId) {
        this.renderTimerImage(false, this.currentRound.timeOut);
      }else if(this.control.resetCount){
        this.renderTimerImage(false, this.control['resetTo']);
      }
    }

    //update current question
    this.currentQuestion = _.find(this.currentRound.questionArray, [
      "id",
      this.control.currentQuestionId
    ]);

    console.log('currentRound => ', this.currentRound)
    console.log('currentQuestion => ', this.currentQuestion)

    if (this.currentRound.questionType == 2) {
      this.cube_image.src = ''              // remove cube image
      this.image.style.background = "";     // remove background image
      this.roundTwoBgImageEle.style.background = "url(" + this.roundTowBgImage.src + ")"    // add new background image

    } else if (this.currentRound.questionType == 4) {
      this.cube_image.src = ''              // remove cube image
      // add new background image
      this.image.style.background = "url(" + this.oneThirdBgImage.src + ")";
      this.image.style.backgroundSize = "cover";
      // remove round two background image
      this.roundTwoBgImageEle.style.background = ""
    } else if (this.currentRound.questionType == 3) {
      this.cube_image.src = ''              // remove cube image
      this.image.style.background = "url(" + this.oneThirdBgImage.src + ")";
      this.image.style.backgroundSize = "cover";
      this.roundTwoBgImageEle.style.background = ""
    }else if(this.currentRound.questionType == 7){
      this.cube_image.src = ''              // remove cube image
      this.image.style.background = "url(" + this.oneThirdBgImage.src + ")";
      this.image.style.backgroundSize = "cover";
      this.roundTwoBgImageEle.style.background = ""
    }
    else {
      this.cube_image.src = this.cubeImage.src;
      this.image.style.background = "url(" + this.oneThirdBgImage.src + ")";
      this.image.style.backgroundSize = "cover";
      this.roundTwoBgImageEle.style.background = ""
    }

    //update timer count
    if (this.currentRound.hasCategory) {
      //update only in selecting theme for round 4
      if (
        !this.control.runCategoryRound &&
        !this.control.finishCategoryRound &&
        !this.control.showQuestion
      ) {
        this.counter = this.currentRound.timeOut;
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
      if (this.prevCurrentQustionId != this.control.currentQuestionId) {
        this.round4hintAnimated = true;
      }
    } else {
      //update when change ques and change round
      if (
        this.prevCurrentRound != this.currentRound.id ||
        this.prevCurrentQustionId != this.currentQuestion.id
      ) {
        this.counter = this.currentRound.timeOut;
        if (this.player) this.player.stop();

        this.blockAnimated = false;
      }
    }
    if (!this.counter == undefined || this.control.resetCount) {
      this.counter = this.currentRound.timeOut;
      if (this.player) this.player.stop();
    }

    // check for hint animation for round 4 when changing ques
    if (this.control.showAns) this.round4hintAnimated = false;

    this.prevCurrentRound = this.currentRound.id;
    this.prevCurrentQustionId = this.currentQuestion.id;

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
        this.control.startCount == TimerEnum.START&&
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

      if (this.currentRound.questionType == 2) {
        console.log('prevCategory id => ', this.prevCategoryId, " , this.currentQuestion.categoryId => ", this.currentQuestion.categoryId)
        if (this.prevCategoryId == undefined) this.prevCategoryId = this.currentQuestion.categoryId
        else if (this.prevCategoryId !== this.currentQuestion.categoryId) {
          this.prevCategoryId = this.currentQuestion.categoryId
        }
        if (this.control.showQuestion){
          if(this.previousQuestionId != this.control.currentQuestionId) {
            this.setGridValue();
            this.previousQuestionId = this.control.currentQuestionId;
          }
          if (this.control.showAns) {
            this.showGridEachAnswer();
          } else {
            // this.hideGridEachAnswer();
          }
        }
        // if (this.prevRoundId != this.control.currentRoundId && this.control.currentRoundId == 2){
        //   this.setGridValue();
        // }
        // if (this.control.showAns) {
        //   this.showGridEachAnswer();
        // } else if(!this.control.showAns && this.control.showQuestion){
        //  // this.hideGridEachAnswer();
        // }
      }

      //else do nothing
    }

    //separate character Answer
    if (this.currentQuestion.isAnsCharacter) {
      this.ansCharArr = this.currentQuestion.ans.split("");
    }

    if(this.currentRound.questionType == 1 && this.currentQuestion.hints.length){
      this.hints = "";
      this.currentQuestion.hints.forEach(hint => {
          this.hints += hint.value;
      });
      console.log("Hints => ", this.hints);
    }

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
      console.log("check", this.control);
      this.blockAnimated = true;
    }
    // animation
    if (
      this.control.startCount == TimerEnum.STOP &&
      !this.control.showAns &&
      !this.control.showQuestion
    )
      this.blockAnimated = false;
    if(this.prevRoundId != this.control.currentRoundId) this.prevRoundId = this.control.currentRoundId;
  }

  countDown() {
    this.interval = setInterval(() => {
      //stop the animated timer when last frame
      if (this.player.ended) this.player.pause();

      if (this.counter <= 0) {
        clearInterval(this.interval);
      } else {
        this.counter = this.counter - 1;
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
    console.log('current question position: ', this.currentQuestion.hints[0].position)
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      // set hint position's background image and value
      if (this.currentQuestion.ans.includes(id)) {
        setTimeout(() => {
          // set hint position's value
          (<HTMLInputElement>document.getElementById(id+'_val')).value =
          this.currentQuestion.hints[0].value.charAt(index).toUpperCase();
          // set hint position's background image
          (<HTMLInputElement>document.getElementById(id+'_bg')).style.background =
            `url(./assets/images/BLUE/Square_Box_Purple.png) no-repeat`;
          // change previous answered background image to current hit position's background image
          let blueBgDiv = (<HTMLDivElement>document.getElementById(id+'_bg'));
          console.log('blueBgDiv: ', blueBgDiv.style.background)
          if(blueBgDiv.style.background.includes('BLUE')){
            blueBgDiv.style.background = `url(./assets/images/BLUE/Square_Box_Purple.png) no-repeat`;
          }
        }, 0);
      }else{
        // set hided letter's background image
        setTimeout(() => {
          let inputValue = (<HTMLInputElement>document.getElementById(id+'_val')).value;
          if(inputValue == ''){
            (<HTMLDivElement>document.getElementById(id+'_bg')).style.background =
            'url(./assets/images/GREEN/Square_Box_Pink.png) no-repeat';
            // 'url(./assets/images/GREEN/green_blank.png) no-repeat';
          }
        }, 0);
      }
    })
  }

  showGridEachAnswer() {
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      setTimeout(() => {
        (<HTMLInputElement>document.getElementById(id+'_val')).value =
          this.currentQuestion.hints[0].value.charAt(index).toUpperCase();
        (<HTMLDivElement>document.getElementById(id+'_bg')).style.background =
          `url(./assets/images/GREEN/Square_Box_Pink.png) no-repeat`;
      }, 0);
    })
  }

  hideGridEachAnswer() {
    console.log('called hideGridEachAnswer function()')
    this.currentQuestion.hints[0].position.forEach((id, index) => {
      if (this.currentQuestion.ans.includes(id)) {
        (<HTMLInputElement>document.getElementById(id+'_val')).value =
          this.currentQuestion.hints[0].value.charAt(index).toUpperCase();
        (<HTMLDivElement>document.getElementById(id+'_bg')).style.background =
          `url(./assets/images/BLUE/Square_Box_Purple.png) no-repeat`
      } else {
        setTimeout(() => {
          if((<HTMLInputElement>document.getElementById(id+'_val')).value != ""
          && (<HTMLDivElement>document.getElementById(id+'_bg')).style.background.includes('BLUE')){
            setTimeout(() => {
              (<HTMLInputElement>document.getElementById(id+'_val')).value = "";
              (<HTMLDivElement>document.getElementById(id+'_bg')).style.background =
                'url(./assets/images/GREEN/Square_Box_Pink.png) no-repeat';
            }, 0);
          }
        }, 0);
      }
    })
  }
}
