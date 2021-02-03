import { Player } from '../../core/models/player';
import { Component, OnInit } from "@angular/core";
import {
  faTimesCircle,
  faPlusCircle,
  faSave
} from "@fortawesome/free-solid-svg-icons";
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
import { Timer } from '../../core/models/timer.model';
import * as fs from 'fs'

const electron = require('electron')
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

  initQuestionState: Question = {
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
  };

  question: Question = _.cloneDeep(this.initQuestionState);

  categoryName: string;
  invalidCategoryName: boolean;
  isEmptyCategoryName: boolean;
  isEmptyWordName: boolean

  noDatabyCategory = false;
  timeoutList: Timer;
  players: Player[]
  playerFontSize: number
  hintValueForR4: string
  clueValueForR4: string
  clueFontSizeForR4: string
  otClueFontSizeForR4: string
  currentWord: any;
  isDefaultOrHint: string
  gridValue: string
  pevCategoryId: number
  invalidWordName: boolean = false;
  roundOneHint: string = '';

  uploadFilePath : string = "";
  uploadFileName : string = "";
  uploadFileType : string = "";
  showVideoModal : boolean = false;
  vidoeUrl: string
  playerCategory: string = 'Player One';

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
    this.updateSetupState();

    //to reset the episode for unsaved
    this.oldEpisode = _.cloneDeep(this.episode);
    window.onbeforeunload = e => {
      saveFile(this.wordWhiz, () => { });
    };
  }

  initHintArrByQuestionType() {
    return Array.from({length: _.result(_.find(this.wordWhiz.questionTypes, ["id",this.currentRound.questionType]),"hintsCount")},
      (x, i) => {
        return {
          id: i + 1,
          value: "",
          position: this.currentRound.questionType == 2 ? [] : 0,                // hint position 1 and 2 is only for round 2, rest all can 0
          isCharacter: this.questionType ? this.questionType.isHintChar : false, // round 3 question cannot sperate like a char
          hintFontSize: null,
          otHintFontSize: null
        };
      }
    ); // [1,2,3,4] create array by hintsCount
  }

  updateSetupState() {
    //update current round
    this.currentRound = _.find(this.episode.rounds, ["id", this.control.currentRoundId]);

    //select the last round and remove condition
    if (this.currentRound == undefined) {
      this.store.dispatch(updateCurrentRoundId({ currentRoundId: this.control.currentRoundId - 1 }));
      this.updateSetupState();
    }
    //current QuestionType
    this.questionType = _.find(this.wordWhiz.questionTypes, [ "id", this.currentRound.questionType]);

    //update current hint count
    this.question.hints = this.initHintArrByQuestionType();
    console.log(' before current category => ', this.currentCategory)
    // if (this.currentRound.questionType == 2 || this.currentRound.questionType == 4) this.currentCategory = undefined
    //initialize current Question Category
    if (!this.currentCategory) {
      this.currentCategory = this.currentRound.categories.length > 0 ? this.currentRound.categories[0] : undefined;
      console.log(' after current category => ', this.currentCategory)
    }

    //no Data in table for round 4
    this.checkQuestionsByCategory();
  }

  clickRound(round) {
    this.store.dispatch(updateCurrentRoundId({ currentRoundId: round.id }));
    this.updateSetupState();
    if (this.currentRound.questionType == 2) {
      if (this.currentCategory) this.pevCategoryId = this.currentCategory.id
      this.currentWord = undefined
      this.setGridValue();
    }else if (this.currentRound.questionType == 5){
      // if not exists create folder with current episoid id,
      let currentEpisodeDir = `${this.getVideoDir()}/episode${this.episode.id}`;
      this.createFolder(`${currentEpisodeDir}`)
      // cut video file from current episode id folder to tempSave folder
      fs.readdirSync(`${currentEpisodeDir}`).forEach(fileName => {
        this.saveVideo(`${currentEpisodeDir}/${fileName}`,`tempSave`,fileName);
        fs.unlinkSync(`${currentEpisodeDir}/${fileName}`)
      })
    }
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

  changeQuestionType(questionType: QuestionTypes) {
    console.log('change question Type ####', questionType)
    //prompt alert to user

    this.currentRound.name = questionType.name;
    this.currentRound.questionArray = [];
    this.currentRound.questionType = questionType.id;
    this.currentRound.categories = [];
    this.currentRound.showfirstAnsChar = questionType.showfirstAnsChar;
    this.currentRound.hasCategory = questionType.hasCategory;
    this.currentRound.point = 0;
    this.currentRound.timeOut = 0;

    if(questionType.id === 2 || questionType.id === 6) {
      this.currentRound.secondPoint = 0;
      this.currentRound.secondTimeOut = 0;
    }
    this.updateSetupState();
  }

  changeCategory(category) {
    this.pevCategoryId = this.currentCategory !== undefined ? this.currentCategory.id : undefined;
    this.currentCategory = category;
    if (this.currentRound.questionType == 2) {
      if (this.pevCategoryId !== this.currentCategory.id) {
        this.clearGridValues(this.pevCategoryId);
        this.setGridValue();
      }
    }
    this.checkQuestionsByCategory();
  }

  filterQuestion(itemList: Question[]) {
    if (this.currentRound.questionType == 2 || this.currentRound.questionType == 4) {
      return _.filter(itemList, item => item.categoryId == this.currentCategory.id);
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
  changePoint(input: HTMLInputElement, key: string) {
    this.currentRound[key] = +input.value;
    if (isNaN(this.currentRound.point)) this.currentRound.point = 0;
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
          if ( question.clue.trim().toUpperCase() == this.question.clue.trim().toUpperCase()) {
            if(question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase()){
              this.invalidQuestion = true;
            }else if (this.currentRound.questionType == 5) this.invalidQuestion = true;
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
        }else if (this.currentRound.questionType == 5){
          this.saveVideo(this.uploadFilePath,'tempSave',`${this.question.clue}.mp4`)
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
            if ( question.clue.trim().toUpperCase() == this.question.clue.trim().toUpperCase()) {
              if(question.ans.trim().toUpperCase() == this.question.ans.trim().toUpperCase()){
                this.invalidQuestion = true;
              }else if (this.currentRound.questionType == 5) this.invalidQuestion = true;
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
            if(this.currentRound.questionType !== 7){
              question.hints[1].hintFontSize = +this.question.hints[1].hintFontSize
            question.hints[1].otHintFontSize = +this.question.hints[1].otHintFontSize
            question.hints[2].hintFontSize = +this.question.hints[2].hintFontSize
            question.hints[2].otHintFontSize = +this.question.hints[2].otHintFontSize
            }
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
  }

  editQuestionList(question: any) {
    this.question = _.cloneDeep(question);
  }

  deleteQuestionList(question_id: number) {
    if (this.currentRound.questionType == 2) this.clearWord(_.find(this.currentRound.questionArray, ['id', question_id]).hints[0].value)
    if(this.currentRound.questionType == 5) {
      let question = this.currentRound.questionArray.find(question => question.id === question_id)
      this.saveVideo(`${this.getVideoDir()}/tempSave/${question.clue}.mp4`, `tempDelete`,`${question.clue}.mp4`);
      this.deleteVideo(`${this.getVideoDir()}/tempSave/${question.clue}.mp4`);
    }
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
    console.log(type)
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
      this.isEmptyCategoryName = _.isEmpty(this.categoryName);
      this.checkModalType = 5;
    } else if (isChange === 6) {
      // delete hint
      this.checkModalType = 6;
    } else if (isChange === 7) {
      // add hint
      this.checkModalType = 7;
      if (_.isEmpty(this.hintValueForR4)) this.isEmptyWordName = true;
    }

    // curentRound's name is null
    if (this.currentRound.name && isChange === 0) {
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
                // cut video from tempSave folder to current episode id folder
                ['tempSave','tempDelete'].forEach(folder => {this.createFolder(`${this.getVideoDir()}/${folder}`)})
                fs.readdirSync(`${this.getVideoDir()}/tempSave`).forEach(fileName => {
                  this.saveVideo(`${this.getVideoDir()}/tempSave/${fileName}`,`episode${this.episode.id}`,fileName);
                  fs.unlinkSync(`${this.getVideoDir()}/tempSave/${fileName}`)
                })
                // remove all videos form temDelete folder
                fs.readdirSync(`${this.getVideoDir()}/tempDelete`).forEach(fileName => {
                  fs.unlinkSync(`${this.getVideoDir()}/tempDelete/${fileName}`)
                })
                this.router.navigate(["/home"], {
                  queryParams: { id: "setup" }
                });
              } else {
                //go back
                _.map(this.wordWhiz.episodes, episode => {
                  if (episode.id == this.oldEpisode.id) {
                    episode.rounds = this.oldEpisode.rounds;
                    episode.players = this.oldEpisode.players;
                  }
                });
                let qeustionClueArr = this.episode.rounds.find(round => round.questionType == 5)
                  .questionArray.map(question => question.clue);
                ['tempSave','tempDelete'].forEach(folder => {
                  this.createFolder(`${this.getVideoDir()}/${folder}`)
                  fs.readdirSync(`${this.getVideoDir()}/${folder}`).forEach(fileName => {
                    if(qeustionClueArr.includes(fileName.split('.')[0])){
                      this.saveVideo(`${this.getVideoDir()}/${folder}/${fileName}`,`episode${this.episode.id}`,fileName);
                    }
                    fs.unlinkSync(`${this.getVideoDir()}/${folder}/${fileName}`)
                  })
                })
                this.router.navigate(["/home"], {
                  queryParams: { id: "setup" }
                });
              }
            } else if (isChange === 4) {
              this.removeCategory(type);
            } else if (isChange === 5) {
              this.addCategory(this.categoryName);
              this.categoryName = "";
            } else if (isChange === 6) {
              this.deleteQuestionList(type)
            } else if (isChange === 7) {
              this.addHintValue(this.hintValueForR4, this.clueValueForR4, this.clueFontSizeForR4, this.otClueFontSizeForR4)
              this.hintValueForR4 = null; this.clueValueForR4 = null; this.clueFontSizeForR4 = null; this.otClueFontSizeForR4 = null
            }
          },
          reason => {
            if (isChange === 3) {
              // navigate after had shown save success alert
              this.router.navigate(["/home"], { queryParams: { id: "setup" } });
            } else if (isChange === 5) {
              this.categoryName = "";
            } else if (isChange == 7) {
              this.hintValueForR4 = null; this.clueValueForR4 = null; this.clueFontSizeForR4 = null; this.otClueFontSizeForR4 = null
            }
            this.invalidCategoryName = false;
            this.invalidWordName = false;
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
    // this.changeCategory(lastIndex);

    this.store.dispatch(updateEpisodeStore({ episode: this.episode }));
    this.clearQuestionBlock();
    this.updateSetupState();

    //reset after add
    this.categoryName = "";
  }

  removeCategory(category) {
    console.log('remove category => ', category)
    this.currentRound.questionArray = this.currentRound.questionArray.filter(
      a => a.categoryId != category.id
    );
    console.log('currentRound qustion array => ', this.currentRound.questionArray)
    // for change category variables
    let currentIndex = _.findIndex(this.currentRound.categories, [
      "id",
      category.id
    ]);
    console.log('current index =>  ', currentIndex)
    let nextIndex = this.currentRound.categories[currentIndex + 1];
    let prevIndex = this.currentRound.categories[currentIndex - 1];

    this.currentRound.categories.splice(
      _.findIndex(this.currentRound.categories, ["id", category.id]),
      1
    );

    // let currentCategory = this.currentRound.categories.filter(
    //   a => a.id == this.currentCategory.id
    // );

    // console.log('currentCategory => ', currentCategory)
    console.log('nextIndex => ', nextIndex)
    console.log('prevIndex => ', prevIndex)

    // change category when remove item
    // if (currentCategory) {
    //   this.changeCategory(currentCategory[0]);
    // } else
    if (!nextIndex) {
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

  addTimeout(timeOut: number, key: string) {
    this.currentRound[key] = timeOut;
  }

  readFileDev() {
    const filePath = process.cwd() + "/release/data/images/timer/timerInfo.json";

    const data = readFileSync(filePath, "utf8");
    this.timeoutList = JSON.parse(data);
  }

  readFileProduction() {
    const filePath = process.env.PORTABLE_EXECUTABLE_DIR + "/data/images/timer/timerInfo.json";

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

  clickGrid(id: string) {
    console.log('grid value => ', id)
    console.log('currentWord => ', this.currentWord)
    if (this.currentWord) {
      const quest = this.currentRound.questionArray.find(({categoryId, hints}) => categoryId == this.currentCategory.id && hints[0].value == this.currentWord.hints[0].value);
      const questIndex = this.currentRound.questionArray.indexOf(quest);
      console.log('question array index => ', questIndex)
      let div = document.getElementById(id) as HTMLDivElement;
      if (this.isDefaultOrHint == 'default') {
        if (this.gridValue) {
          div.innerText = this.gridValue.charAt(0);
          this.gridValue = this.gridValue.substring(1);
          this.currentRound.questionArray[questIndex].hints[0].position.push(id);
          if (!this.gridValue.length) {
            this.currentWord = undefined
          }
        }
      } else if (this.isDefaultOrHint == 'hint') {
        if (div.style.backgroundColor == '') {
          div.style.backgroundColor = 'red'
          this.currentRound.questionArray[questIndex].ans += id + ',';
        } else {
          div.style.backgroundColor = '';
          console.log('id => ', id)
          let old = id + ','
          this.currentRound.questionArray[questIndex].ans = this.currentRound.questionArray[questIndex].ans.replace(old, '');
        }
      }
      console.log('this.currentRound.questionArray => ', this.currentRound.questionArray[questIndex])
    }
  }

  addHintValue(hintValue: string, clue: string, hintFontSize: string, otHintFontSize: string) {
    console.log('current category => ', this.currentCategory)
    console.log(`hint value => ${hintValue}, clue => ${clue}, clueFontSize => ${hintFontSize}, otClueFontSize => ${otHintFontSize}`)
    if (this.currentCategory) {
      let generateId =
        this.currentRound.questionArray.length == 0
          ? 1
          : this.currentRound.questionArray.slice(-1).pop().id + 1;
      this.currentRound.questionArray.push({
        ...this.question,
        id: generateId,
        categoryId: this.currentRound.questionType == 2 || this.currentRound.questionType == 4
          ? this.currentCategory.id
          : 0,
        clue: clue,
        isAnsCharacter: this.questionType.isAnsChar,
        clueFontSize: this.question.clueFontSize == null ? 50 : this.question.clueFontSize,
        otClueFontSize: this.question.otClueFontSize == null ? 50 : this.question.otClueFontSize,
        ansFontSize: this.question.ansFontSize == null ? 50 : this.question.ansFontSize,
        otAnsFontSize: this.question.otAnsFontSize == null ? 50 : this.question.otAnsFontSize,
        hints: [{
          ...this.question.hints[0], value: hintValue.toUpperCase(), position: [],
          hintFontSize: hintFontSize == null ? 50 : +hintFontSize, otHintFontSize: otHintFontSize == null ? 50 : +otHintFontSize
        }]
      });
      console.log('current category => ', this.currentRound)
      this.noDatabyCategory = false;
    }
  }

  checkDuplicateWord(word: string) {
    console.log(' filter question => ', this.filterQuestion(this.currentRound.questionArray))
    if (this.filterQuestion(this.currentRound.questionArray)) {
      for (let i = 0; i < this.filterQuestion(this.currentRound.questionArray).length; i++) {
        if (
          this.filterQuestion(this.currentRound.questionArray)[i].hints[0].value.trim().toUpperCase() ==
          word.trim().toUpperCase()
        ) {
          this.invalidWordName = true;
          break;
        } else {
          this.invalidWordName = false;
        }
      }
    }

    this.isEmptyWordName = word == "" || word.trim() == "";
  }

  clickHint(question) {
    this.currentWord = question
    this.gridValue = question.hints[0].value
    console.log('gridValue => ', this.gridValue)
  }

  changeGridStatus(val: string) {
    this.isDefaultOrHint = val;
    console.log('grid status => ', this.isDefaultOrHint)
  }

  setGridValue() {
    console.log('current category -=> ', this.currentCategory)
    this.currentRound.questionArray.filter(qustion => qustion.categoryId == this.currentCategory.id).forEach(question => {
      question.hints.forEach((hint) => {
        hint.position.forEach((id, index) => {
          setTimeout(() => {
            (<HTMLDivElement>document.getElementById(id)).innerText = hint.value.charAt(index);
          }, 0);
        });
      })
      if (question.ans) {
        console.log('question answer => ', question.ans.split(','))
        question.ans.split(',').forEach(id => {
          if (id != '') {
            setTimeout(() => {
              (<HTMLDivElement>document.getElementById(id)).style.backgroundColor = 'red'
            }, 0);
          }
        })
      }
    })
  }

  clearWord(hintValue: string) {
    console.log('current category => ', this.currentCategory)
    if (hintValue) {
      let questionArr = this.currentRound.questionArray.filter(question =>
        question.categoryId == this.currentCategory.id && question.hints[0].value == hintValue)
      let questionArrIndex = this.currentRound.questionArray.indexOf(questionArr[0])

      this.currentRound.questionArray[questionArrIndex].hints[0].position.forEach(id => {
        (<HTMLDivElement>document.getElementById(id)).innerText = '';
      });
      if (this.currentRound.questionArray[questionArrIndex].ans) {
        this.currentRound.questionArray[questionArrIndex].ans.split(',').forEach(id => {
          if (id != '') {
            (<HTMLDivElement>document.getElementById(id)).style.backgroundColor = '';
          }

        });

      }
      this.currentRound.questionArray[questionArrIndex].hints[0].position = []
      this.currentRound.questionArray[questionArrIndex].ans = ''
      this.setGridValue();
      this.currentWord = undefined
    }
  }

  clearGridValues(id: number) {
    this.currentRound.questionArray.filter(qustion => qustion.categoryId == id).forEach(question => {
      question.hints.forEach((hint) => {
        hint.position.forEach((id, index) => {
          setTimeout(() => {
            (<HTMLDivElement>document.getElementById(id)).innerText = '';
          }, 0);
        });
      })
      if (question.ans) {
        question.ans.split(',').forEach(id => {
          if (id != '') {
            setTimeout(() => {
              (<HTMLDivElement>document.getElementById(id)).style.backgroundColor = ''
            }, 0);
          }
        })

      }
    })
  }

  uploadFile() {
    const dialog = electron.remote.dialog;
    dialog.showOpenDialog({
      title: 'Select the File to be uploaded',
      defaultPath: process.env.PORTABLE_EXECUTABLE_DIR,
      buttonLabel: 'Upload',
      // Restricting the user to only Text Files.
      filters: [
        { name: 'All Files', extensions: ['mp4'] }
      ],
      // Specifying the File Selector Property
      properties: ['openFile']
    }).then(file => {
      // Stating whether dialog operation was
      // cancelled or not.
      console.log(file.filePaths);
      if (!file.canceled) {
        this.uploadFilePath = file.filePaths[0]
        this.uploadFileName = this.uploadFilePath.substring(this.uploadFilePath.lastIndexOf('\\') + 1).split('.')[0]
        this.uploadFileType = this.uploadFilePath.substring(this.uploadFilePath.lastIndexOf('\\') + 1).split('.')[1]
        console.log(`file name: ${this.uploadFileName}, file type: ${this.uploadFileType}, file path: ${this.uploadFilePath}`)
        // fs.writeFileSync( this.rootFilePath + fileName + ".mp4", fs.readFileSync(this.uploadFilePath))
        this.question.clue = this.uploadFileName
      }else{
        this.uploadFilePath = "";
        this.uploadFileName = "";
        this.question.clue = this.uploadFileName
      }
    }).catch(err => {
      console.log(err)
    });
  }
  saveVideo(copyFrom: string, saveTo: string, videoNameWithExten: string){
    const dir = `${this.getVideoDir()}/${saveTo}`;
    this.createFolder(dir)
    fs.writeFileSync(`${dir}/${videoNameWithExten}` , fs.readFileSync(copyFrom))
  }

  getVideoDir(): string{
    if (AppConfig.production) return `${process.env.PORTABLE_EXECUTABLE_DIR}/data/videos`
    else return `${process.cwd()}/release/data/videos`
  }

  deleteVideo(filePath: string){
    fs.unlinkSync(filePath)
  }

  createFolder(folderPath: string){
    if (!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath);
    }
  }

  previewVideo(videoModal, videoName: string){
    this.vidoeUrl = `file://${this.getVideoDir()}/tempSave/${videoName}.mp4`;
    this.modalService
      .open(videoModal, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => reason
      );
  }

  choosePlayerCategory(playerName: string){
    this.playerCategory = playerName
  }
}
