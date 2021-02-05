import {Component, OnInit} from "@angular/core";
import {Store} from "@ngrx/store";
import {Router, ActivatedRoute} from "@angular/router";
import {AppConfig} from "../../environments/environment";
import {initStore} from "../core/actions/wordWhiz.actions";
import {
  updateCurrentEpisodeId,
  updateFontSettingControl
} from "../core/actions/control.actions";
import {updateEpisodeStore} from "../core/actions/episode.actions";
import {WordWhiz} from "../core/models/wordWhiz";
import initData from "../../assets/i18n/initData.json";
import addEpisodePlayers from "../../assets/i18n/addEpisodePlayers.json";
import addEpisodeRounds from "../../assets/i18n/addEpisodeRounds.json";
import {faPlusCircle, faMinusCircle} from "@fortawesome/free-solid-svg-icons";
import {Images} from "../common/images";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFile
} from "fs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import * as _ from "lodash";
import {saveFile} from "../common/functions";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  paramObj: any;
  prevRoute: string;
  userView = true;
  FontSize: number = 100;
  faPlusCircle = faPlusCircle;

  faMinusCircle = faMinusCircle;

  Images = Images;

  wordWhiz: WordWhiz;

  jsonObj: any;

  addModal: number;
  episodeId: number;

  constructor(
    private modalService: NgbModal,
    private store: Store<{ wordWhiz: WordWhiz }>,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.store.subscribe(item => {
      this.wordWhiz = item.wordWhiz;
    });

    //check dev or not
    if (AppConfig.production) {
      try {
        this.readFileProduction();
      } catch {
        // write file from initJson when init File is not exist in first time
        this.writeFileforProduction();
        this.readFileProduction();
      }

      console.log("initData >> ", this.jsonObj);
      if (this.wordWhiz.questionTypes.length == 0) {
        // initialize Data only when no store
        this.store.dispatch(initStore({wordWhiz: this.jsonObj}));
      }
    } else {
      //----DEVELOPMENT----//
      // this.readFileDev();

      console.log("development initData >> ", initData);
      this.store.dispatch(initStore({wordWhiz: initData}));
    }

    //init FontSettings from json data
    this.store.dispatch(
      updateFontSettingControl({fontSettings: this.wordWhiz.fontSettings})
    );
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.paramObj = {...params.keys, ...params};
      this.prevRoute = this.paramObj.params.id;
    });

    if (this.prevRoute == "control") this.userView = true;
    else if (this.prevRoute == "setup") this.userView = false;
  }

  clickEpisode(episode) {
    if (episode.rounds[0].questionArray.length == 0 && this.userView) {
      //empty question to show ,go first to setup
      //show toast or prompt
    } else {
      //update currentEpisode and navigate
      this.store.dispatch(updateCurrentEpisodeId({currentEpisodeId: episode.id}));

      this.store.dispatch(updateEpisodeStore({episode}));

      if (this.userView) this.router.navigate(["/control"]);
      else this.router.navigate(["/setup"]);
      console.clear();
    }
  }

  open(content, isAdd, episode) {
    this.episodeId = episode.id;
    // this.addModal = false;
    // if (isAdd) this.addModal = true;
    this.addModal = isAdd;
    this.modalService
      .open(content, {ariaLabelledBy: "modal-basic-title", centered: true})
      .result.then(
      result => {
        if (isAdd == 1) this.addEpisodeSetup();
        else if (isAdd == 0) this.removeEpisode(episode);
        else if (isAdd == 2) this.closeApp();
      },
      reason => reason
    );
  }

  addEpisodeSetup() {
    // ADD NEW EPISODE FROM ADMIN
    this.wordWhiz.episodes.push({
      id:
        this.wordWhiz.episodes.length == 0
          ? 1
          : this.wordWhiz.episodes.slice(-1).pop().id + 1,
      players: _.cloneDeep(addEpisodePlayers),
      rounds: _.cloneDeep(addEpisodeRounds)
    });
    saveFile(this.wordWhiz, () => {
    });
  }

  removeEpisode(episode) {
    let removeIndex = _.findIndex(this.wordWhiz.episodes, ["id", episode.id]);
    this.wordWhiz.episodes.splice(removeIndex, 1);

    let prevId = 0;
    this.wordWhiz.episodes.map(episode => {
      if (episode.id != prevId + 1) episode.id = episode.id - 1;
      prevId = episode.id;
    });
    saveFile(this.wordWhiz, () => {
    });
  }

  exportFile(path) {
    // need to encode in production if implement
    writeFile(
      path + "/wordWhiz_" + new Date().getTime() + ".json",
      JSON.stringify(this.wordWhiz),
      err => {
        if (err) {
          console.log("err");
        }
        alert("success");
      }
    );
  }

  export() {
    let filePath = "";

    if (AppConfig.production) {
      filePath = process.env.PORTABLE_EXECUTABLE_DIR + "/export";
    } else {
      filePath = process.cwd() + "/export";
    }

    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }

    this.exportFile(filePath);
  }

  writeFileforProduction() {

    const filePath = process.env.PORTABLE_EXECUTABLE_DIR + "/data";
    if (!existsSync(filePath)) {
      mkdirSync(filePath);
    }
    writeFileSync(filePath + "/releaseInitData.json", JSON.stringify(initData));
  }

  readFileProduction() {
    const filePath = process.env.PORTABLE_EXECUTABLE_DIR + "/data/releaseInitData.json";
    console.log(filePath);
    const encodedData = readFileSync(filePath, "utf8");
    this.jsonObj = JSON.parse(encodedData);
  }

  readFileDev() {
    const filePath = process.cwd() + "/src/assets/i18n/initData.json";

    const data = readFileSync(filePath, "utf8");
    this.jsonObj = JSON.parse(data);
  }

  closeApp() {
    require("electron").remote.app.quit();
  }
}
