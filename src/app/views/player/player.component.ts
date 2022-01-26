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

  Images = Images;

  constructor(
    private store: Store<{
      control: Control;
      episode: Episode;
      externalDevice: ExternalDevice
    }>,
    readonly nz: NgZone,
    private route: ActivatedRoute
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
        this.updatePlayerState();
      });
    });

    ipc.on("submit-answer", (event, message) => {
      this.store.dispatch(playerAnswer({playerAnswer: message}))
      console.log(message);
    })
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.paramObj = { ...params.keys, ...params };
      this.playerId = this.paramObj.params.id;
    });

    console.log('player id >>> ', this.playerId);

    this.store.subscribe(item => {
      this.episode = item.episode;
      this.control = item.control
    });
  }

  updatePlayerState() {
    this.episode.players.map(player => {
      if (player.id == this.playerId) {
        this.playerPoint = player.point;
        this.playerName = player.name;
      }
    });
  }
}
