import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-typo-word-admin',
  templateUrl: './typo-word-admin.component.html',
  styleUrls: ['./typo-word-admin.component.scss']
})
export class TypoWordAdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
