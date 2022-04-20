import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Images } from "../../common/Images";
import { Episode } from '../../core/models/episode';
import { WordWhizStore } from '../../core/state/wordwhiz.store';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit, OnDestroy {

  Images = Images;
  currentEpisodeId: number;
  currentEpisode: Episode;
  currentEpisodeIndex: number;
  wordWhizStore = WordWhizStore.Instance;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentEpisodeId = parseInt(params['episodeId']);
      this.currentEpisodeIndex = parseInt(params['episodeIndex'])
      this.currentEpisode = this.wordWhizStore.getEpisodeById(this.currentEpisodeId);
    })
    console.log("Current Episode => ", this.currentEpisode);
  }

  ngOnDestroy(): void {
  }

}
