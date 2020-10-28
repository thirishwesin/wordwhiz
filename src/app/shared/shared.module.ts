import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { PageNotFoundComponent } from "./components/";
import { WebviewDirective } from "./directives/";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { OnlyNumber } from "./directives/only-number.directive";

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, OnlyNumber],
  imports: [CommonModule, TranslateModule],
  exports: [
    TranslateModule,
    WebviewDirective,
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    OnlyNumber
  ],
})
export class SharedModule { }
