import { AppConfig } from "../../environments/environment";
import { Base64 } from "./base64";
import { writeFile } from "fs";

export function saveFile(wordWhiz, callback) {
  let data = JSON.stringify(wordWhiz, null, 2);
  let filePath = process.cwd() + "/src/assets/i18n/initData.json";
  if (AppConfig.production) {
    filePath =
      process.env.PORTABLE_EXECUTABLE_DIR + "/data/releaseInitData.json";
    data = Base64.encode(JSON.stringify(wordWhiz));
  }
  writeFile(filePath, data, err => {
    if (err) throw err;
    console.log("Data written to file");
    callback();
  });
}
