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
  currentEpisode: Episode;
  wordWhizStore = WordWhizStore.Instance;

  constructor() { }

  ngOnInit(): void {
    console.log("Current Episode =>", this.wordWhizStore.getCurrentEpisode());
  }

  ngOnDestroy(): void {
  }

}
