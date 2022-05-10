import { Component, OnInit } from '@angular/core';
import { Images } from '../../../common/images';

@Component({
  selector: 'app-wrong-word-admin',
  templateUrl: './wrong-word-admin.component.html',
  styleUrls: ['./wrong-word-admin.component.scss']
})
export class WrongWordAdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
