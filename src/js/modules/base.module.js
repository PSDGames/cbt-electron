/**
 * Created by du.kulaevskiy
 */

'use strict';

class Base {
    constructor () {
        this._events = {};
    }

    _initEvent(event) {
        if (!this._events.hasOwnProperty(event)) {
            this._events[event] = [];
        }
    }

    _notify(event, ...args) {
        this._initEvent(event);

        for(let i = 0; i < this._events[event].length; ++i) {
            let func = this._events[event][i];
            let copy_args = args.slice();

            // TODO Event object
            copy_args.unshift({
                name: event
            });

            func.apply(this, copy_args);
        }
    }

    unsubscribe(event, func) {
        this._initEvent(event);

        if (!func) {
            this._events[event] = [];    
        } else {
            for (let i = 0; i < this._events[event].length; ++i) {
                let f = this._events[event][i];
                if (f === func) {
                    this._events[event].splice(i, 1);
                }
            }
        }   
    }

    subscribe(event, func) {
        this._initEvent(event);

        this._events[event].push(func);
    }
}

module.exports = Base;
