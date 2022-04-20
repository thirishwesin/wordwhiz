import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification, Subscription } from 'rxjs';
import { WordWhizStore } from '../../core/state/wordwhiz.store';
import { Images } from "../../common/Images";
import { Episode } from '../../core/models/episode';
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ModalConstant } from '../../common/constant/modal.constant';
import { assign as _assign, cloneDeep as _cloneDeep, isFunction as _isFunction } from 'lodash';
import { rounds } from '../../common/default-app-data';
import { STORE_KEY } from '../../common/constant/store-key.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  wordWhizStore = WordWhizStore.Instance;
  wordWhizStore$: Subscription;
  unsubscribeOnAnyDataChange: Function;
  isUserView: boolean = true;
  episodes: Episode[] = [];
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;

  Images = Images;
  modalConstant = ModalConstant;

  constructor(private router: Router, private modalService: NgbModal, private nz: NgZone) { }

  ngOnInit(): void {
    this.episodes = this.wordWhizStore.getAllEpisodes();
    this.wordWhizStore$ = this.wordWhizStore.onAnyDataChange().subscribe(res => {
      this.unsubscribeOnAnyDataChange = res.unsubscribe;
      this.nz.run(() => {
        this.episodes = _cloneDeep(res.newValue[STORE_KEY.EPISODES]);
      })
    })
  }

  clickUserOrAdmin(isUserView: boolean) {
    this.isUserView = isUserView;
  }

  openModal(modalQuestion: string, modalAction: string, episodeId?: number) {
    const modalRef = this.modalService.open(ModalComponent, {
      ariaLabelledBy: "modal-basic-title",
      centered: true
    });
    _assign(modalRef.componentInstance, { modalQuestion, modalAction, episodeId });
    modalRef.result.then(
      (reason: string) => {
        switch (reason) {
          case this.modalConstant.ACTION.ADD:
            let _episodes: Episode[] = this.wordWhizStore.getAllEpisodes();
            const newEpisode = this.wordWhizStore.addEpisode({
              episodeId: _episodes.length > 0 ? _episodes[_episodes.length - 1].episodeId + 1 : 1,
              rounds: rounds
            })
            console.log("New Episode => ", newEpisode);
            break;
          case this.modalConstant.ACTION.REMOVE:
            this.wordWhizStore.deleteEpisode(episodeId);
            break;
        }
      },
    )
  }

  clickEpisode(episodeId: number, episodeIndex: number) {
    this.router.navigate(['control', episodeId, episodeIndex]).then(isRouted => {
      console.log("Is successfully routed => ", isRouted);
    }).catch(error => {
      console.error("Getting error when route to control screen => ", error);
    })
  }

  ngOnDestroy() {
    if(_isFunction(this.unsubscribeOnAnyDataChange)){
      this.unsubscribeOnAnyDataChange();
    }
    this.wordWhizStore$.unsubscribe();
  }

}
