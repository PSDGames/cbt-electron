/**
 * Created by mongolrgata
 */

'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const dialog = remote.dialog;
const app = remote.app;

const fs = require('fs');
const dots = require('dot').process({path: './src/views'});

//noinspection JSFileReferences
const FileDragDrop = require('./js/modules/dragdrop.module');
//noinspection JSFileReferences
const Arc = require('./js/modules/Arc.module');

const RECENT_ARCFILE_KEY = '662589eb-a07c-42eb-bac2-ddd9f75f7fc9';

/**
 * @param {string} elementID
 */
var removeChildren = function removeChildren(elementID) {
    var element = document.getElementById(elementID);

    while (element.lastChild) {
        element.removeChild(element.lastChild);
    }
};

/**
 * @param {string} viewName
 */
var switchView = function switchView(viewName) {
    var views = document.getElementsByClassName('view');

    for (var i = 0, n = views.length; i < n; ++i) {
        views[i].style.visibility = 'hidden'; // TODO display?
    }

    document.getElementById(viewName).style.visibility = 'visible';
};


/**
 * @param {string} viewName
 */
var clearView = function clearView(viewName) {
    removeChildren(viewName);
};

document.addEventListener('DOMContentLoaded', function () {
    var recentArcFile = localStorage.getItem(RECENT_ARCFILE_KEY);

    if (recentArcFile) {
        // TODO check existence
        setArcFile(recentArcFile);
    } else {
        switchView('directory-request');
    }

    let dropZone = document.getElementsByClassName('dropZone')[0];
    let dragdrop = new FileDragDrop(dropZone);

    dragdrop.subscribe('drop', function (e, file) {
        let p = file.path;
        setArcFile(p);
    });

    dropZone.addEventListener('click', function () {
        openArcFile()
    })
});

/**
 * @param {string} pathName
 */
var setArcFile = function setArcFile(pathName) {
    localStorage.setItem(RECENT_ARCFILE_KEY, pathName);

    switchView('arc-list');
    clearView('arc-list');

    var arc = new Arc(pathName);
    var fileNames = arc.getFileNameList();
    var view = document.getElementById('arc-list');

    for (let i = 0, n = fileNames.length; i < n; ++i) {
        var contentName = fileNames[i];

        //noinspection JSUnresolvedFunction
        view.innerHTML += dots.arcfile({
            name: contentName
        });
    }

    /**
     * @type {HTMLButtonElement}
     */
    var close = document.createElement('button');

    close.textContent = 'Закрыть';
    close.className = 'close';

    close.onclick = function() {
        switchView('directory-request');
    };

    view.appendChild(close);
};

var openArcFile = function openDirectory() {
    var path = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {name: 'Arc Files', extensions: ['arc']},
            {name: 'All Files', extensions: ['*']}
        ]
    });

    if (path.length) {
        setArcFile(path[0]);
    }
};

var menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            {
                label: 'Open directory',
                accelerator: 'Ctrl+O',
                click: openArcFile
            },
            {
                label: 'Exit',
                accelerator: 'Alt+Q',
                click: function () {
                    app.quit();
                }
            }
        ]
    }
]);

Menu.setApplicationMenu(menu);
