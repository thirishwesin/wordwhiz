import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordWhizStore } from '../../core/state/wordwhiz.store';
import data from '../../core/state/initData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  wordWhizStore =  WordWhizStore.Instance;
  wordWhizStore$: Subscription;
  unsubscribe: Function;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.wordWhizStore.initData(data);

    this.wordWhizStore$ = this.wordWhizStore.onAnyDataChange().subscribe(res => {
        this.unsubscribe = res.unsubscribe;
        console.log("Res => ", res);
      })

    this.wordWhizStore.setItemWithKey("test", Math.random());
   }

   ngOnDestroy() {
      console.log("On Destroy");
      this.unsubscribe();
      this.wordWhizStore$.unsubscribe();
   }

}
