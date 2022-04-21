import { Component, OnInit } from '@angular/core';
import { Images } from '../../common/images';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  Images = Images;

  constructor() { }

  ngOnInit(): void {
  }

}
