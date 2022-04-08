import { Component, OnInit } from '@angular/core';
import { Images } from "../../common/Images";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
