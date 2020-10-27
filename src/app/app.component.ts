import { Component } from "@angular/core";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    public router: Router
  ) {
    translate.setDefaultLang("en");
    console.log("AppConfig", AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log("Mode electron");
      console.log("Electron ipcRenderer", electronService.ipcRenderer);
      console.log("NodeJS childProcess", electronService.childProcess);
      // if (!window.localStorage.getItem("endpoints")) {
      //     this.router.navigate(["main"]);
      //     window.localStorage.setItem("endpoints", "true");
      //   } else {
      //     this.router.navigate(["home"]);
      //   }
    } else {
      console.log("Mode web");
    }
  }
}
