/**
 * Created by mongolrgata
 */

'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({width: 1024, height: 768});

    mainWindow.setMenu(null);
    mainWindow.loadURL('file://' + __dirname + '/src/index.html');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});
