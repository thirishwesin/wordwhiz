import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ModalComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [
    TranslateModule, 
    WebviewDirective, 
    FormsModule, 
    NgbModule,
    FontAwesomeModule,
    ModalComponent
  ],
})
export class SharedModule { }
