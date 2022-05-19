import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-scramble-word-admin',
  templateUrl: './scramble-word-admin.component.html',
  styleUrls: ['./scramble-word-admin.component.scss']
})
export class ScrambleWordAdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
