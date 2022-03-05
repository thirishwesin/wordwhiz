import { Component, OnInit, NgZone, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { WordWhiz } from "../../core/models/wordWhiz";
import { Control } from "../../core/models/control";
import { updateStoreFromControl } from "../../core/actions/control.actions";
import { Images } from "../../common/images";
import { ActivatedRoute } from "@angular/router";
import { Episode } from "../../core/models/episode";
import { ExternalDevice } from "../../core/models/externalDevice";
import { playerAnswer } from "../../core/actions/externalDevice.actions";
import { Answer } from "../../core/models/answer";
import { ScrambleHint, ScrambleWord } from "../../core/models/scramble";
import { find as _find } from 'lodash';
import { Round } from "../../core/models/round";
import { Question } from "../../core/models/question";
import { defaultTypWordImage } from "../../common/base64";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
  paramObj: any;
  playerId: number;
  episode: Episode;
  playerPoint: number;
  control: Control
  playerName: string;
  typoWordQuestion: string;
  typoWordImage: string = defaultTypWordImage;
  Images = Images;
  currentRoundId: number;
  sendFromPlayerId: number;
  answerObj: Answer;
  playerAnsFontSize: number;
  playerClueFontSize: number;
  scrambleWord: ScrambleWord = {
    word1: "",
    word2: "",
    word3: "",
    word4: ""
  }
  scrambleHint: ScrambleHint = {
    hint1: "",
    hint2: "",
    hint3: "",
    hint4: ""
  }
  currentRound: Round;
  currentQuestion: Question;

  constructor(
    private store: Store<{
      control: Control;
      episode: Episode;
      externalDevice: ExternalDevice
    }>,
    readonly nz: NgZone,
    public route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    const ipc = require("electron").ipcRenderer;

    //Listen to control screen
    ipc.on("word_whizControl", (event, message) => {
      console.log("incoming broadcast event from control", message);
      //to render the view
      this.nz.run(() => {
        if ((message.control.currentRoundId != this.control.currentRoundId || message.control.currentQuestionId != this.control.currentQuestionId) && message.control.currentPlayerId != this.playerId) {
          this.scrambleWord = {
            word1: "",
            word2: "",
            word3: "",
            word4: ""
          }
          this.typoWordImage = defaultTypWordImage;
        }
        //update store
        this.store.dispatch(updateStoreFromControl({ control: message }));
        this.episode = message.episode;
        this.control = message.control;
        console.log("control ",this.control);
        this.currentRound = _find(this.episode.rounds, [
          "id",
          this.control.currentRoundId
        ]);

        this.currentQuestion = _find(this.currentRound.questionArray, [
          "id",
          this.control.currentQuestionId
        ]);

        //Typo word round
        if (this.currentRound.questionType == 7) {
          this.typoWordQuestion = this.currentQuestion.clue;
        }

        //Scramble word round
        if (this.currentRound.questionType == 8) {
          let hint = this.currentQuestion.clue;
          //Handle question word count 3 or 4
          if (hint.length == 3) {
            delete this.scrambleHint.hint4;
            delete this.scrambleWord.word4;
          }
          //Initialize scramble hint to show question in scramble round
          for (let i = 1; i <= hint.length; i++) {
            let singleWord = hint.charAt(i - 1);
            switch (i) {
              case 1:
                this.scrambleHint.hint1 = singleWord; break;
              case 2:
                this.scrambleHint.hint2 = singleWord; break;
              case 3:
                this.scrambleHint.hint3 = singleWord; break;
              case 4:
                this.scrambleHint.hint4 = singleWord; break;
              default: break;
            }
          };
        }
        this.updatePlayerState();
        this.sendFromPlayerId = message.control.currentPlayerId != undefined ?
          parseInt(message.control.currentPlayerId.match(/\d/g)[0]) : 0;
      });
    });

    //Listen to tablet screen
    ipc.on("submit-answer", (event, message) => {
      this.store.dispatch(playerAnswer({ playerAnswer: message }));
      this.nz.run(() => {
        this.answerObj = { ...message };
        this.sendFromPlayerId = parseInt(this.answerObj.sendFrom.match(/\d/g)[0]);
        this.updateAnswerState();
      })
    })
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.paramObj = { ...params.keys, ...params };
      this.playerId = this.paramObj.params.id;
    });

    this.store.subscribe(item => {
      this.episode = item.episode;
      this.control = item.control;
    });
  }

  updatePlayerState() {

    this.playerAnsFontSize = this.currentQuestion ? this.currentQuestion.playerAnsFontSize : 0;
    this.playerClueFontSize = this.currentQuestion ? this.currentQuestion.playerClueFontSize : 0;

    //Handle specific player screen
    this.episode.players.map(player => {
      if (player.id == this.playerId) {
        this.playerPoint = player.point;
        this.playerName = player.name;
      }
    });
  }

  updateAnswerState() {
    if (this.answerObj) {
      if (this.control.currentRoundId == 7 && this.sendFromPlayerId == this.playerId) { //Typo word round
        this.typoWordImage = this.answerObj.answer;
      } else if (this.control.currentRoundId == 8 && this.sendFromPlayerId == this.playerId) { //Scramble word round
        const { answerIndex, answer } = this.answerObj;
        //The tablet screen will pass answerIdex -1 when click backspace button
        if (parseInt(answerIndex) != -1) {
          //Add answer word in order
          for (let key in this.scrambleWord) {
            if (!this.scrambleWord[key]) {
              this.scrambleWord[key] = answer;
              break;
            }
          }
        } else {
          for (let i = Object.keys(this.scrambleWord).length; i > 0; i--) {
            //Remove last answer
            if (this.scrambleWord[`word${i}`]) {
              this.scrambleWord[`word${i}`] = "";
              break;
            }
          }
        }
      }
    }
  }
}