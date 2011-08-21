//- JavaScript source code

//- math-tests.js ~~
//                                                      ~~ (c) SRW, 18 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

    q.lib("base");
    q.lib("math");
    q.lib("test");

    q.test$run("math", [
        {
            args:   [[-1, 2, -3, 4]],
            answer: "1,2,3,4",
            func:   q.math$abs,
            name:   "abs: Array of Numbers"
        },
        {
            args:   [-1],
            answer: "1",
            func:   q.math$abs,
            name:   "abs: single Number"
        },
        {
            args:   [2, 3],
            answer: "6",
            func:   q.math$prod,
            name:   "prod: two Numbers"
        },
        {
            args:   [[1, 2, 3], [4, 5, 6]],
            answer: "4,10,18",
            func:   q.math$prod,
            name:   "prod: two Arrays of Numbers"
        },
        {
            args:   [[1, 2, 3], 4],
            answer: "4,8,12",
            func:   q.math$prod,
            name:   "prod: Array of Numbers and a single Number"
        },
        {
            args:   [5, [6, 7, 8]],
            answer: "30,35,40",
            func:   q.math$prod,
            name:   "prod: single Number and Array of Numbers"
        },
        {
            args:   [{0: 1, 1: 2, 2: 3, length: 3}],
            answer: "6",
            func:   q.math$prod,
            name:   "prod: single Array-Like Object"
        },
        {
            args:   [42],
            answer: "42",
            func:   q.math$prod,
            name:   "prod: single Number"
        },
        {
            args:   [{0: 1, 1: 2, length: 2}, {0: 3, 1: 4, length: 2}],
            answer: "3,8",
            func:   q.math$prod,
            name:   "prod: two Array-Like Objects"
        },
        {
            args:   [2, 3],
            answer: "5",
            func:   q.math$sum,
            name:   "sum: two Numbers"
        },
        {
            args:   [[1, 2, 3], [4, 5, 6]],
            answer: "5,7,9",
            func:   q.math$sum,
            name:   "sum: two Arrays of Numbers"
        },
        {
            args:   [[1, 2, 3], 4],
            answer: "5,6,7",
            func:   q.math$sum,
            name:   "sum: Array of Numbers and a single Number"
        },
        {
            args:   [5, [6, 7, 8]],
            answer: "11,12,13",
            func:   q.math$sum,
            name:   "sum: single Number and Array of Numbers"
        },
        {
            args:   [{0: 1, 1: 2, 2: 3, length: 3}],
            answer: "6",
            func:   q.math$sum,
            name:   "sum: single Array-Like Object"
        },
        {
            args:   [42],
            answer: "42",
            func:   q.math$sum,
            name:   "sum: single Number"
        },
        {
            args:   [{0: 1, 1: 2, length: 2}, {0: 3, 1: 4, length: 2}],
            answer: "4,6",
            func:   q.math$sum,
            name:   "sum: two Array-Like Objects"
        }
    ]);

});

//- vim:set syntax=javascript:
