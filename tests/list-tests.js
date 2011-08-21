//- JavaScript source code

//- list-tests.js ~~
//                                                      ~~ (c) SRW, 18 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Library test: "list"

    q.lib("base");
    q.lib("list");
    q.lib("test");

    q.test$run("list", [
        {
            args:   [["a", "e", "i", "o", "u"], ["pi", "e"]],
            answer: "a,e,i,o,u,pi",
            func:   q.list$uniq,
            name:   "uniq: two Arrays of Strings"
        },
        {
            args:   [[1, 2, 3, 4, 5], [2, 4, 6, 8]],
            answer: "2,4",
            func:   q.list$intersect,
            name:   "intersect: two Arrays of Numbers"
        }
    ]);

});

//- vim:set syntax=javascript:
