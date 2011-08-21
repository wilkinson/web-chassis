//- JavaScript source code

//- nitpick.js ~~
//
//  This program shows how to use Web Chassis to load JSLint from an external
//  file in order to check its own source code. It depends on the existence of
//  a "read" method that can read files from the filesystem right now, but I
//  plan to write a proper stringifier for functions so that JSLint can be used
//  to introspect live objects -- this will have an immediate impact on Quanah.
//
//  To use this program, you will need to load JSLint into the environment.
//  Then, invoking from the command-line is as simple as
//      $ chassis linter.js jslint.js
//
//                                                      ~~ (c) SRW, 21 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q, global) {
    "use strict";

 // Prerequisites

    q.lib("base");

    if (typeof global.JSLINT !== 'function') {
        q.die("Awaiting JSLINT ...");
    }

    if (typeof global.read !== 'function') {
        throw new Error('The "nitpick" function requires filesystem access.');
    }

 // Declarations

    var isScript, nitpick;

 // Definitions

    isScript = /\.js$/;

    nitpick = function (filename) {
        var txt;
        txt = global.read(filename);
        if (global.JSLINT(txt) === true) {
            q.puts('No errors found in "' + filename + '".');
        } else {
            q.base$ply(global.JSLINT.errors).by(function (key, val) {
                q.puts(val);
            });
        }
    };

 // Invocations

    q.base$ply(q.argv).by(function (key, val) {
        if (isScript.test(val)) {
            nitpick(val);
        }
    });

});

//- vim:set syntax=javascript:
