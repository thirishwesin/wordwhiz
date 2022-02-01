import { Component, OnInit, NgZone } from "@angular/core";
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
  typoWordImage: string = defaultTypWordImage;
  Images = Images;
  currentRoundId: number;
  sendFromPlayerId: number;
  answerObj: Answer;
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
    public route: ActivatedRoute
  ) {
    const ipc = require("electron").ipcRenderer;

    ipc.on("word_whizControl", (event, message) => {
      console.log("incoming broadcast event from control", message);
      //update store
      this.store.dispatch(updateStoreFromControl({ control: message }));
      //to render the view
      this.nz.run(() => {
        this.episode = message.episode;
        this.control = message.control
        this.currentRound = _find(this.episode.rounds, [
          "id",
          this.control.currentRoundId
        ]);
        console.log("Episode => ", this.episode);
        console.log("Current Round => ", this.currentRound);
        if (this.currentRound.questionType == 8) {
          this.currentQuestion = _find(this.currentRound.questionArray, [
            "id",
            this.control.currentQuestionId
          ]);
          let hint = this.currentQuestion.hints[0].value;
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

        this.sendFromPlayerId = message.control.currentPlayerId != undefined ? parseInt(message.control.currentPlayerId.match(/\d/g)[0]) : 0;
      
        if (message.control.clickTimer != true) {
          this.scrambleWord = {
            word1: "",
            word2: "",
            word3: "",
            word4: ""
          }

          this.typoWordImage = defaultTypWordImage;
        }
      });
    });

    ipc.on("submit-answer", (event, message) => {
      this.store.dispatch(playerAnswer({ playerAnswer: message }));
      this.nz.run(() => {
        this.answerObj = { ...message };
        this.sendFromPlayerId = parseInt(this.answerObj.sendFrom.match(/\d/g)[0]);
        this.updatePlayerState();
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
    console.log(this.typoWordImage);

  }

  updatePlayerState() {
    this.episode.players.map(player => {
      if (player.id == this.playerId) {
        this.playerPoint = player.point;
        this.playerName = player.name;
      }
    });

    if (this.answerObj) {
      if (this.control.currentRoundId == 7 && this.sendFromPlayerId == this.playerId) {
        this.typoWordImage = this.answerObj.answer;
      } else if (this.control.currentRoundId == 8 && this.sendFromPlayerId == this.playerId) {
        const { answerIndex, answer } = this.answerObj;
        switch (answerIndex) {
          case '1': this.scrambleWord.word1 = answer; break;
          case '2': this.scrambleWord.word2 = answer; break;
          case '3': this.scrambleWord.word3 = answer; break;
          case '4': this.scrambleWord.word4 = answer; break;
        }
      }
    }
  }
}
