/**
 * Created by mongolrgata
 */

'use strict';

const FileI = require('./FileIO.module').FileI;

class Arc {
    /**
     * @param {string} fullPath
     */
    constructor(fullPath) {
        this._file = new FileI(fullPath);
        this._readHeader();
    }
    
    _readHeader() {
        var fileCount = this._file.readUnsigned32();

        this._file.seek(4);

        this._fileLengths = [];
        this._fileOffsets = [];
        this._fileNames = [];

        for (let i = 0; i < fileCount; ++i) {
            this._fileLengths.push(this._file.readUnsigned32());
            this._fileOffsets.push(this._file.readUnsigned32());
            this._fileNames.push(this._file.readFileName());
        }
    }

    /**
     * @returns {string[]}
     */
    getFileNameList() {
        return this._fileNames;
    }
}

module.exports = Arc;
