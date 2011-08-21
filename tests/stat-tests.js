//- JavaScript source code

//- stat-tests.js ~~
//                                                      ~~ (c) SRW, 17 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

    q.lib("base");
    q.lib("stat");
    q.lib("test");

    q.test$run("stat", [
        {
            args:   [0],
            answer: "0.5",
            func:   q.stat$pnorm,
            name:   "pnorm: single number"
        },
        {
            args:   [[-1, 1]],
            answer: "0.15865525393145702,0.841344746068543",
            func:   q.stat$pnorm,
            name:   "pnorm: array of numbers"
        }
    ]);

});

//- vim:set syntax=javascript:
