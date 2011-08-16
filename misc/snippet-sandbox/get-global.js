//- JavaScript source code

//- get-global.js ~~
//
//  This is a quick server-side script that I wrote while exploring the subtle
//  differences between the global environments of various interpreters.
//
//                                                      ~~ (c) SRW, 13 Aug 2011

var log, supported;

log = (function () {
    "use strict";
    if ((typeof console === 'object') && (typeof console.log === 'function')) {
        return function () {
            console.log.apply(console, arguments);
        };
    }
    if (typeof print === 'function') {
        return function () {
            print.apply(print, arguments);
        };
    }
    throw new Error("The 'log' definition fell through.");
}());

supported = (function () {
    "use strict";
    return (this === null);
}.call(null));

if (supported === true) {
    log("Strict mode is supported.");
} else {
    log("This interpreter does not support strict mode.");
}

if (typeof GLOBAL === 'object') {
    log("Found 'GLOBAL' object.");
}

if (typeof exports === 'object') {
    log("Found 'exports' object.");
}

//- vim:set syntax=javascript:
