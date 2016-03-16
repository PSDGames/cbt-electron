/**
 * Created by mongolrgata
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const FileI = require('./FileIO.module').FileI;

/**
 * @param {string} fullPath
 * @param {string} destination
 */
module.exports.dearcer = function (fullPath, destination) {
    var file = new FileI(fullPath);
    var fileCount = file.readUnsigned32();

    file.seek(4);

    var fileLengths = [];
    var fileNames = [];
    var i;

    for (i = 0; i < fileCount; ++i) {
        fileLengths.push(file.readUnsigned32());
        file.seek(4); // file_offset
        fileNames.push(file.readFileName());
    }

    var arcName = path.basename(fullPath, '.arc');
    var directory = path.join(destination, arcName);

    mkdirp.sync(directory);

    for (i = 0; i < fileCount; ++i) {
        var filename = path.join(directory, fileNames[i]);
        fs.writeFileSync(filename, file.read(fileLengths[i]), {'encoding': null});
    }
};
