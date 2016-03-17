/**
 * Created by mongolrgata
 */

'use strict';

const remote = require('electron').remote;
const Menu = remote.Menu;
const dialog = remote.dialog;
const app = remote.app;

const fs = require('fs');
const path = require('path');
const dots = require('dot').process({path: './src/views'});

const RECENT_ARCFILE_KEY = '662589eb-a07c-42eb-bac2-ddd9f75f7fc9';
// const RECENT_WORKSPACE_KEY = 'dae30f50-b34c-4e4c-83e6-fe0eeb2ded50';

// var dearcer = require('./js/modules/arcfile.module').dearcer;
//noinspection JSFileReferences
var FileDragDrop = require('./js/modules/dragdrop.module');
//noinspection JSFileReferences
var Arc = require('./js/modules/Arc.module');

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
        views[i].style.visibility = 'hidden';
    }

    document.getElementById(viewName).style.visibility = 'visible';
};

// /**
//  * @param {string} dialogName
//  */
// var showDialog = function showDialog(dialogName) {
//     document.getElementById(dialogName).style.visibility = 'visible';
// };

/**
 * @param {string} viewName
 */
var clearView = function clearView(viewName) {
    removeChildren(viewName);
};

document.addEventListener('DOMContentLoaded', function () {
    var recentArcFile = localStorage.getItem(RECENT_ARCFILE_KEY);

    //if (recentArcFile) {
    //    setDirectory(recentArcFile);
    //} else {
    switchView('directory-request');
    //}

    let dropZone = document.getElementsByClassName('dropZone')[0];
    let dragdrop = new FileDragDrop(dropZone);
    dragdrop.subscribe('drop', function (e, file) {
        let p = file.path;

        let dir = p.split(path.sep);
        dir.pop();
        // dir = dir.join(path.sep);

        setDirectory(p);
        //setDirectory(path.join(dir, path.basename(p).split('.')[0]));
    });

    dropZone.addEventListener('click', function () {
        openArcFile()
    })
});

/**
 * @param {string} pathName
 */
var setDirectory = function setDirectory(pathName) {
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
    
    // var arcfiles = document.getElementsByClassName('arcfile');
    //
    // for (i = 0, n = arcfiles.length; i < n; ++i) {
    //     arcfiles[i].addEventListener('click', function () {
    //         console.log(path.join(pathName, this.textContent), localStorage.getItem(RECENT_WORKSPACE_KEY))
    //         dearcer(path.join(pathName, this.textContent), localStorage.getItem(RECENT_WORKSPACE_KEY));
    //     });
    // }
    //
    // var recentWorkspace = localStorage.getItem(RECENT_WORKSPACE_KEY);
    //
    // if (recentWorkspace) {
    //     setWorkspace(recentWorkspace);
    // } else {
    //     showDialog('workspace-request');
    // }
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
        setDirectory(path[0]);
    }
};

// function closeDialog(dialogName) {
//     document.getElementById(dialogName).style.visibility = 'hidden';
// }
//
// /**
//  * @param element
//  * @param {string} html
//  */
// var appendHtml = function appendHtml(element, html) {
//     var dummy = document.createElement('div');
//     dummy.innerHTML = html;
//
//     while (dummy.children.length > 0) {
//         element.appendChild(dummy.children[0]);
//     }
// };
//
// var updateWorkspace = function updateWorkspace(event) {
//     if (event !== 'rename') {
//         return;
//     }
//
//     var workspace = document.getElementById('workspace');
//     var workFolder = localStorage.getItem(RECENT_WORKSPACE_KEY);
//     var directories = fs.readdirSync(workFolder);
//
//     workspace.innerHTML = null;
//     for (var i = 0, n = directories.length; i < n; ++i) {
//         var stats = fs.statSync(path.join(workFolder, directories[i]));
//
//         workspace.innerHTML += dots.workfolder({
//             name: directories[i],
//             isFile: stats.isFile()
//         })
//     }
// };
//
// var setWorkspace = function setWorkspace(pathName) {
//     localStorage.setItem(RECENT_WORKSPACE_KEY, pathName);
//     closeDialog('workspace-request');
//
//     appendHtml(document.getElementById('arc-list'), dots.workspace());
//
//     fs.watch(pathName, updateWorkspace);
//     updateWorkspace('rename', null);
// };
//
// var openWorkspace = function openWorkspace() {
//     var path = dialog.showOpenDialog({
//         properties: ['openDirectory']
//     });
//
//     if (path.length) {
//         setWorkspace(path[0]);
//     }
// };

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
