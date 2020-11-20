import { app, BrowserWindow, screen, globalShortcut } from "electron";
import * as path from "path";
import * as url from "url";

let win, serve, splash;
const args = process.argv.slice(1);
serve = args.some(val => val === "--serve");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", () => {
    // globalShortcut.register("CommandOrControl+X", () => {
    //   alert();
    //   console.log("CommandOrControl+X is pressed");
    // });

    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    splash = new BrowserWindow({
      height: 400,
      width: 400,
      transparent: true,
      frame: false,
      //alwaysOnTop: true,
      center: true,
    });

    splash.loadURL(
      url.format({
        pathname: path.join(__dirname, "splash.svg"),
        protocol: "file:",
        slashes: true,
      })
    );

    // Create the browser window.
    win = new BrowserWindow({
      width: size.width,
      height: size.height,
      //fullscreen: true,
      show: false,
      frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: serve,
      },
    });

    if (serve) {
      require("electron-reload")(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`),
        // exclude initFile for electron hot reload in development
        //ignored: [/node_modules|[\/\\]\./, /initData\.json/],
      });

      win.loadURL("http://localhost:4200");

      win.webContents.openDevTools();
    } else {
      // in production

      win.loadURL(
        url.format({
          pathname: path.join(__dirname, "dist/index.html"),
          protocol: "file:",
          slashes: true,
        })
      );

      // disable reload
      globalShortcut.register("f5", function () {
        console.log("f5 is pressed");
      });
      globalShortcut.register("CommandOrControl+R", function () {
        console.log("CommandOrControl+R is pressed");
      });
    }

    win.once("ready-to-show", () => {
      setTimeout(() => {
        splash.destroy();
        win.show();

        // pervent close
        // win.on("close", function(event) {
        //   event.preventDefault();
        //   event.returnValue = false;
        // });
      }, 1500);
    });
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      win.show();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}
