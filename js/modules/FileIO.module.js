/**
 * Created by mongolrgata
 */

'use strict';

const fs = require('fs');
const iconv = require('iconv-lite');

var decodeChar = function (bytes) {
    return iconv.decode(bytes, 'utf16-le');
};

const NUL_CHAR = decodeChar(new Buffer([0x00, 0x00]));

var FileI = function (fullPath) {
    this._file = fs.readFileSync(fullPath);
    this._cursor = 0;
};

FileI.prototype.read = function read(size) {
    var result = this._file.slice(this._cursor, this._cursor + size);
    this._cursor += size;

    return result;
};

FileI.prototype.readUnsigned32 = function readUnsigned32() {
    var slice = this.read(4);
    var result = 0;

    for (var i = 0, j = 3; i < 4; ++i, --j) {
        result <<= 8;
        result += slice[j];
    }

    return result;
};

FileI.prototype.seek = function seek(offset) {
    this._cursor += offset;
};

FileI.prototype.readFileName = function readFileName() {
    var result = '';

    while (true) {
        var char = decodeChar(this.read(2));

        if (char == NUL_CHAR) {
            break;
        }

        result += char;
    }

    return result;
};

module.exports.FileI = FileI;
