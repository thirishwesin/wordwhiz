import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './component';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalComponent } from './component/modal/modal.component';
import { ApngTimerComponent } from './component/apng-timer/apng-timer.component';
import { SimpleTimerComponent } from './component/simple-timer/simple-timer.component';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ModalComponent, ApngTimerComponent, SimpleTimerComponent],
  imports: [CommonModule, TranslateModule, FormsModule],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ModalComponent, ApngTimerComponent, SimpleTimerComponent
  ],
})
export class SharedModule { }
