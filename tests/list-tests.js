//- JavaScript source code

//- list-tests.js ~~
//                                                          ~~ SRW, 26 Jun 2011

chassis(function (q) {
    "use strict";

 // Library test: "sets"

    q.lib("base") || q.die();
    q.lib("list") || q.die();
    q.lib("test") || q.die();

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
