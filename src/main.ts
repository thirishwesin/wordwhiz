import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { AppConfig } from "./environments/environment";

if (AppConfig.production) {
  enableProdMode();

  //hide console log in production
  console.log = function() {
    return false;
  };
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    preserveWhitespaces: false,
  })
  .catch(err => console.error(err));
