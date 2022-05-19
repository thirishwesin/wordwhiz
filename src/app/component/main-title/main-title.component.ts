import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-title',
  templateUrl: './main-title.component.html',
  styleUrls: ['./main-title.component.scss']
})
export class MainTitleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.font_size(90);
  }
  font_size(header_f) {
    document.documentElement.style.setProperty("--header-font-size", header_f+"px");
  }
}
