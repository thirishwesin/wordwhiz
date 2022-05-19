import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConstant } from '../../../common/constant/modal.constant';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() modalQuestion: string;
  @Input() modalAction: string;
  @Input() episodeId: number;
  modalConstant = ModalConstant;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
