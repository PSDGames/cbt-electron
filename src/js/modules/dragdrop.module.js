/**
 * Created by du.kualevskiy
 */

'use strict';


const Base = require('./base.module');

class FileDragDrop extends Base {
    constructor (element) {
        this.element = element;
    }

    init () {
        let self = this;

        if (this.element) {
            this._hoverover = function(e) {
                self.element.classList.add('hover');
                return false;
            };
            this.element.addEventListener('dragover', this._hoverover);
                
            this._hoverleave = function(e) {
                self.element.classList.remove('hover');
                return false;
            };
            this.element.addEventListener('dragleave', this._hoverleave);

            this._drop = function(e) {
                self.element.classList.remove('hover');
                self.element.classList.add('drop');

                var file = e.dataTransfer.files[0];
                
                self.element.innerHTML = 'Файл получен!';
                console.log(file);

                e.preventDefault();
                return false;
            };
            this.element.addEventListener('drop', this._drop);
        }
    }

    get element () {
        return this._element;
    }

    set element (element) {
        this.clear();
        this._element = element;
        this.init();
    }

    clear () {
        if (this.element) {
            this.element.removeEventListener('dragover', this._hoverover);
            this.element.removeEventListener('dragleave', this._hoverleave);
            this.element.removeEventListener('drop', this._drop);
        }
    }
}

module.export = FileDragDrop;