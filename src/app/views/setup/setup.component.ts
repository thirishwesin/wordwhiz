import { Player } from './../../core/models/player';
import { Component, OnInit } from "@angular/core";
import {
  faTimesCircle,
  faPlusCircle,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { remote } from "electron";
import { Store } from "@ngrx/store";
import { WordWhiz } from "../../core/models/wordWhiz";
import { Episode } from "../../core/models/episode";
import { Round } from "../../core/models/round";
import { Control } from "../../core/models/control";
import { updateCurrentRoundId } from "../../core/actions/control.actions";
import { Router } from "@angular/router";
import { Images } from "../../common/images";

import * as _ from "lodash";
import { Question } from "../../core/models/question";
import { QuestionTypes } from "../../core/models/questionTypes";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { saveFile } from "../../common/functions";
import { QuestionCategory } from "../../core/models/questionCategory";
import { updateEpisodeStore } from "../../core/actions/episode.actions";
import { readFileSync } from "fs";
import { AppConfig } from "../../../environments/environment";

@Component({
  selector: "app-setup",
  templateUrl: "./setup.component.html",
  styleUrls: ["./setup.component.scss"]
})
export class SetupComponent implements OnInit {
  faTimesCircle = faTimesCircle;
  faPlusCircle = faPlusCircle;
  faSave = faSave;
  Images = Images;
  wordWhiz: WordWhiz;
  episode: Episode;
  currentRound: Round;
  currentCategory: QuestionCategory;
  control: Control;
  questionType: QuestionTypes;

  delRoundId;
  questionName;
  invalidQuestion: boolean;
  checkModalType: number;

  oldEpisode: Episode;

  initQuestionState = {
    id: 0,
    clue: "",
    categoryId: 0,
    hints: [],
    ans: "",
    isAnsCharacter: false,
    clueFontSize: null,
    otClueFontSize: null,
    ansFontSize: null,
    otAnsFontSize: null
  } as Question;

  question = _.cloneDeep(this.initQuestionState);

  categoryName: string;
  invalidCategoryName: boolean;
  isEmptyCategoryName: boolean;

  noDatabyCategory = false;
  timeoutList: any;
  players: Player[]
  playerFontSize: number

  constructor(
    private store: Store<{
      wordWhiz: WordWhiz;
      episode: Episode;
      control: Control;
    }>,
    public router: Router,
    public modalService: NgbModal
  ) {
    store.subscribe(item => {
      this.wordWhiz = item.wordWhiz;
      this.episode = item.episode;
      this.control = item.control;
    });

    //get episodetimeout
    if (AppConfig.production) {
      this.readFileProduction();
    } else {
      this.readFileDev();
    }

    //reload state
    if (this.episode.id == 0) this.router.navigate(["/home"]);
  }

  ngOnInit() {
    console.log("wordWhiz state in setUp", this.wordWhiz);
    console.log("episode state in setUp", this.episode);
    console.log("control state in setUp", this.control);

    this.updateSetupState();

    //to reset the episode for unsaved
    this.oldEpisode = _.cloneDeep(this.episode);

    // remote.getCurrentWindow().on("close", e => {
    //   //saveFile before quit
    //   saveFile(this.wordWhiz, () => {});
    // });
    window.onbeforeunload = e => {
      saveFile(this.wordWhiz, () => { });
    };
  }

  initHintArrByQuestionType() {
    return Array.from(
      {
        length: _.result(
          _.find(this.wordWhiz.questionTypes, [
            "id",
            this.currentRound.questionType
          ]),
          "hintsCount"
        )
      },
      (x, i) => {
        return {
          id: i + 1,
          value: "",
          position: this.currentRound.questionType == 2 ? 1 : 0,                // hint position 1 and 2 is only for round 2, rest all can 0
          isCharacter: this.questionType ? this.questionType.isHintChar : false // round 3 question cannot sperate like a char
        };
      }
    ); // [1,2,3,4] create array by hintsCount
  }

  updateSetupState() {
    //update current round
    this.currentRound = _.find(this.episode.rounds, [
      "id",
      this.control.currentRoundId
    ]);
    //select the last round and remove condition
    if (this.currentRound == undefined) {
      this.store.dispatch(
        updateCurrentRoundId({
          currentRoundId: this.control.currentRoundId - 1
        })
      );
      this.updateSetupState();
    }
    console.log('current round => ', this.currentRound)
    //current QuestionType
    this.questionType = _.find(this.wordWhiz.questionTypes, [
      "id",
      this.currentRound.questionType
    ]);

    //update current hint count
    this.question.hints = this.initHintArrByQuestionType();

    //initialize current Question Category
    if (!this.currentCategory) {
      this.currentCategory =
        this.currentRound.categories.length > 0
          ? this.currentRound.categories[0]
          : undefined;
    }

    //no Data in table for round 4
    this.checkQuestionsByCategory();
  }

  clickRound(round) {
    this.store.dispatch(updateCurrentRoundId({ currentRoundId: round.id }));
    this.updateSetupState();

    //clear question block
    this.clearQuestionBlock();
  }

  addRound() {
    this.episode.rounds.push({
      id: this.episode.rounds.slice(-1).pop().id + 1,
      name: "",
      point: 0,
      questionArray: [],
      questionType: 1,
      categories: [],
      showfirstAnsChar: false,
      hasCategory: false,
      timeOut: 0,
      roundNameFontSize: null,
      clueLabelFontSize: null,
    });
    let lastIndex = _.last(this.episode.rounds);
    this.store.dispatch(updateCurrentRoundId({ currentRoundId: lastIndex.id }));
    this.updateSetupState();

    //clear question block
    this.clearQuestionBlock();
    console.log("current round name >>  ", this.currentRound.name);
  }

  changeQuestionType(questionType) {
    //prompt alert to user
    this.currentRound.name = questionType.name;
    this.currentRound.point = 0;
    this.currentRound.questionArray = [];
    this.currentRound.questionType = questionType.id;
    this.currentRound.categories = [];
    this.currentRound.showfirstAnsChar = questionType.showfirstAnsChar;
    this.currentRound.hasCategory = questionType.hasCategory;
    this.currentRound.timeOut = 0;
    this.updateSetupState();
  }

  changeCategory(category) {
    this.currentCategory = category;

    this.checkQuestionsByCategory();
  }

  filterQuestion(itemList: Question[]) {
    if (this.currentRound.hasCategory) {
      return _.filter(
        itemList,
        item => item.categoryId == this.currentCategory.id
      );
    }
    return itemList;
  }

  checkQuestionsByCategory() {
    //check Question count to show no data by category
    if (this.currentCategory) {
      let found = _.find(this.currentRound.questionArray, [
        "categoryId",
        this.currentCategory.id
      ]);
      if (!found) {
        this.noDatabyCategory = true;
      } else this.noDatabyCategory = false;
    } else this.noDatabyCategory = true;
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  changePoint(event: any) {
    this.currentRound.point = parseInt(event.target.value);
    if (isNaN(this.currentRound.point)) this.currentRound.point = null;
  }

  // changeTimeout(event: any) {
  //   this.currentRound.timeOut = parseInt(event.target.value);
  //   if (isNaN(this.currentRound.timeOut)) this.currentRound.timeOut = null;
  // }

  changeHint(event: any, hintId) {
    this.question.hints.map(hint => {
      if (hint.id == hintId) hint.value = event.target.value;
    });
  }

  exchangeHint(position, hintId) {
    this.question.hints.map(hint => {
      if (hint.id == hintId) {
        hint.position = position;
      }
    });
  }

  saveQuestion() {
    this.invalidQuestion = false;

    //new question
    if (this.question.id == 0) {
      //check the question arrays except self
      this.currentRound.questionArray.map(question => {
        if (!this.currentRound.hasCategory) {
          if (
            question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase() &&
            question.clue.trim().toUpperCase() == this.question.clue.trim().toUpperCase()
          ) {
            this.invalidQuestion = true;
          }
        } else {
          if (question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase()) this.invalidQuestion = true;
        }
      });

      if (!this.invalidQuestion) {
        //add question
        if (this.currentRound.questionType == 4) {
          this.question.hints[0].hintFontSize = 30; this.question.hints[0].otHintFontSize = 30;
          this.question.hints[1].hintFontSize = 30; this.question.hints[1].otHintFontSize = 30;
          this.question.hints[2].hintFontSize = 30; this.question.hints[2].otHintFontSize = 30;
        } else if (this.currentRound.questionType == 3) {
          this.question.hints[0].hintFontSize = 50; this.question.hints[0].otHintFontSize = 50
        }

        let generateId =
          this.currentRound.questionArray.length == 0
            ? 1
            : this.currentRound.questionArray.slice(-1).pop().id + 1;
        this.currentRound.questionArray.push({
          ...this.question,
          id: generateId,
          categoryId: this.currentRound.hasCategory
            ? this.currentCategory.id
            : 0,
          isAnsCharacter: this.questionType.isAnsChar,
          clueFontSize: this.question.clueFontSize == null ? 50 : this.question.clueFontSize,
          otClueFontSize: this.question.otClueFontSize == null ? 50 : this.question.otClueFontSize,
          ansFontSize: this.question.ansFontSize == null ? 50 : this.question.ansFontSize,
          otAnsFontSize: this.question.otAnsFontSize == null ? 50 : this.question.otAnsFontSize,
        });
        // this.questionTextToUpperCase(this.question);
        console.log('question => ', this.question)
        this.noDatabyCategory = false;
      }
    } else {
      //edit existing question

      this.currentRound.questionArray
        .filter(question => question.id != this.question.id)
        .map(question => {
          //check the question arrays except self
          if (!this.currentRound.hasCategory) {
            if (
              question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase() && question.clue.trim().toUpperCase() == this.question.clue.trim().toUpperCase()
            ) {
              this.invalidQuestion = true;
            }
          } else {
            if (question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase()) {
              this.invalidQuestion = true;
            }
          }
        });
      if (!this.invalidQuestion) {
        console.log('selected round id => ', this.currentRound.id)
        this.currentRound.questionArray.map(question => {
          if (question.id == this.question.id && !this.currentRound.hasCategory) {
            question.clue = this.question.clue;
            question.clueFontSize = +this.question.clueFontSize
            question.otClueFontSize = +this.question.otClueFontSize
            question.ans = this.question.ans;
            question.ansFontSize = +this.question.ansFontSize
            question.otAnsFontSize = +this.question.otAnsFontSize
            question.hints = this.question.hints;
            if (this.currentRound.id == 2 || this.currentRound.id == 3 || this.currentRound.id == 4) {
              question.hints[0].hintFontSize = +this.question.hints[0].hintFontSize
              question.hints[0].otHintFontSize = +this.question.hints[0].otHintFontSize
            }
          } else if (question.id == this.question.id && this.currentRound.hasCategory) {
            question.clue = this.question.clue;
            question.clueFontSize = +this.question.clueFontSize
            question.otClueFontSize = +this.question.otClueFontSize
            question.ans = this.question.ans;
            question.ansFontSize = +this.question.ansFontSize
            question.otAnsFontSize = +this.question.otAnsFontSize
            question.hints = this.question.hints;
            question.hints[0].hintFontSize = +this.question.hints[0].hintFontSize
            question.hints[0].otHintFontSize = +this.question.hints[0].otHintFontSize
            question.hints[1].hintFontSize = +this.question.hints[1].hintFontSize
            question.hints[1].otHintFontSize = +this.question.hints[1].otHintFontSize
            question.hints[2].hintFontSize = +this.question.hints[2].hintFontSize
            question.hints[2].otHintFontSize = +this.question.hints[2].otHintFontSize
          }
        });
      }
    }

    if (!this.invalidQuestion) {
      //clear question block
      this.clearQuestionBlock();
    }
  }

  cancel() {
    this.question = {
      ...this.initQuestionState,
      hints: this.initHintArrByQuestionType()
    };
    this.invalidQuestion = false;
  }

  saveAll(content_setup) {
    this.oldEpisode = _.cloneDeep(this.episode);
    saveFile(this.wordWhiz, () => { });

    // this.openModal(content_setup, 3, "");
  }

  editQuestionList(question: any) {
    this.question = _.cloneDeep(question);
  }

  deleteQuestionList(question_id: number) {
    this.currentRound.questionArray.splice(
      _.findIndex(
        this.currentRound.questionArray,
        question => question.id == question_id
      ),
      1
    );

    let prevId = 0;
    this.currentRound.questionArray.map(question => {
      if (question.id != prevId + 1) {
        question.id = question.id - 1;
      }
      prevId = question.id;
    });
    console.log("question array >> ", this.currentRound.questionArray);

    this.checkQuestionsByCategory();
  }

  disabled() {
    //check for hints
    let validHint = true;
    if (this.question.hints.length > 0) {
      this.question.hints.map(hint => {
        if (hint.value.trim() == "") {
          validHint = false;
        }
      });
    }

    if (this.question.ans.trim() == "" || this.currentRound.name.trim() == "" || !validHint || this.question.clue.trim() == "") {
      return true;
    }

    // check for category array
    if (
      this.currentRound.hasCategory &&
      this.currentRound.categories.length < 1
    )
      return true;

    return false;
  }

  openModal(content_setup, isChange, type) {
    if (isChange === 0) {
      //change question Type
      this.questionName = type.name;
      this.checkModalType = isChange;
    } else if (isChange === 1) {
      //delete round
      this.delRoundId = type.id;
      this.checkModalType = isChange;
    } else if (isChange === 2) {
      //goback
      this.checkModalType = isChange;
    } else if (isChange === 3) {
      //success alert in save
      this.checkModalType = isChange;
    } else if (isChange === 4) {
      // delete category
      this.checkModalType = isChange;
    } else if (isChange === 5) {
      // add category
      if (_.isEmpty(this.categoryName)) this.isEmptyCategoryName = true;
      else this.isEmptyCategoryName = false;
      this.checkModalType = 5;
    }

    // curentRound's name is null
    if (this.currentRound.name == "" && isChange === 0) {
      this.changeQuestionType(type);
      //clear question block
      this.clearQuestionBlock();
    } else {
      this.modalService
        .open(content_setup, {
          ariaLabelledBy: "modal-basic-title",
          centered: true
        })
        .result.then(
          result => {
            console.log("result", result);
            if (isChange === 0) {
              this.changeQuestionType(type);
              //clear question block
              this.clearQuestionBlock();
            } else if (isChange === 1) {
              this.removeRound(type);
            } else if (isChange === 2) {
              if (result == "SaveBack") {
                this.saveAll(content_setup);
                this.router.navigate(["/home"], {
                  queryParams: { id: "setup" }
                });
              } else {
                //go back
                _.map(this.wordWhiz.episodes, episode => {
                  if (episode.id == this.oldEpisode.id) {
                    episode.rounds = this.oldEpisode.rounds;
                    console.log('old episode => ', this.oldEpisode.players)
                    episode.players = this.oldEpisode.players;
                  }
                });
                this.router.navigate(["/home"], {
                  queryParams: { id: "setup" }
                });
              }
            } else if (isChange === 4) {
              this.removeCategory(type);
            } else if (isChange === 5) {
              this.addCategory(this.categoryName);
              this.categoryName = "";
            }
          },
          reason => {
            if (isChange === 3) {
              // navigate after had shown save success alert
              this.router.navigate(["/home"], { queryParams: { id: "setup" } });
            } else if (isChange === 5) {
              this.categoryName = "";
            }
            this.invalidCategoryName = false;
            return reason;
          }
        );
    }
  }

  removeRound(round) {
    this.episode.rounds.splice(
      _.findIndex(this.episode.rounds, ["id", round.id]),
      1
    );

    let prevId = 0;
    this.episode.rounds.map(round => {
      if (round.id != prevId + 1) {
        round.id = round.id - 1;
      }
      prevId = round.id;
    });
    this.updateSetupState();
  }

  questionClueChanged(event) {
    this.invalidQuestion = false;
  }
  questionClueFontSizeChanged(event) {

  }
  questionAnsChanged(event) {
    this.invalidQuestion = false;
  }
  questionAnsFontSizeChanged(event) {

  }

  clearQuestionBlock() {
    this.question = {
      ...this.initQuestionState,
      hints: this.initHintArrByQuestionType()
    };
  }

  addCategory(categoryName) {
    let id;
    // check id undifined
    if (this.currentRound.categories.length > 0)
      id = this.currentRound.categories.slice(-1).pop().id + 1;
    else id = 0;
    this.currentRound.categories.push({
      id: id,
      name: categoryName
    });

    let lastIndex = _.last(this.currentRound.categories);
    this.changeCategory(lastIndex);

    this.store.dispatch(updateEpisodeStore({ episode: this.episode }));
    this.clearQuestionBlock();
    this.updateSetupState();

    //reset after add
    this.categoryName = "";
  }

  removeCategory(category) {
    this.currentRound.questionArray = this.currentRound.questionArray.filter(
      a => a.categoryId != category.id
    );

    // for change category variables
    let currentIndex = _.findIndex(this.currentRound.categories, [
      "id",
      category.id
    ]);
    let nextIndex = this.currentRound.categories[currentIndex + 1];
    let prevIndex = this.currentRound.categories[currentIndex - 1];

    this.currentRound.categories.splice(
      _.findIndex(this.currentRound.categories, ["id", category.id]),
      1
    );

    let currentCategory = this.currentRound.categories.filter(
      a => a.id == this.currentCategory.id
    );

    // change category when remove item
    if (currentCategory) {
      this.changeCategory(currentCategory[0]);
    } else if (!nextIndex) {
      this.changeCategory(prevIndex);
    } else {
      this.changeCategory(nextIndex);
    }
    this.clearQuestionBlock();
    this.updateSetupState();
  }

  changedCategoryName(categoryName) {
    for (let i = 0; i < this.currentRound.categories.length; i++) {
      if (
        this.currentRound.categories[i].name.trim().toUpperCase() ==
        categoryName.trim().toUpperCase()
      ) {
        this.invalidCategoryName = true;
        break;
      } else {
        this.invalidCategoryName = false;
      }
    }

    if (categoryName == "" || categoryName.trim() == "")
      this.isEmptyCategoryName = true;
    else this.isEmptyCategoryName = false;
  }

  addTimeout(timeout) {
    this.currentRound.timeOut = timeout;
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

  changePlayerPointSize(pointFontSize) {
    this.episode.players.map(player => player.pointFontSize = pointFontSize)
  }

  questionTextToUpperCase(question) {
    this.question.clue = question.clue.toUpperCase();
    this.question.ans = question.ans.toUpperCase();
    if (this.question.hints.length == 1) this.question.hints[0].value = question.hints[0].value.toUpperCase();
    else if (question.hints.length == 3) {
      this.question.hints[0].value = question.hints[0].value.toUpperCase();
      this.question.hints[1].value = question.hints[1].value.toUpperCase();
      this.question.hints[2].value = question.hints[2].value.toUpperCase();
    }
    console.log('called questionTextToUpperCase.............')
  }
}
