import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-cross-word-admin',
  templateUrl: './cross-word-admin.component.html',
  styleUrls: ['./cross-word-admin.component.scss']
})
export class CrossWordAdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
