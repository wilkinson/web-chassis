//- JavaScript source code

//- common-letters.js ~~
//
//  Based on a joke I just read that involved letters common to each word in a
//  set, I wrote this to find common characters in arbitrary sets of words.
//
//                                                      ~~ (c) SRW, 04 Sep 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

 // Declarations

    var sieve;

 // Definitions

    sieve = function (x) {
        var sets;
        sets = q.base$map(x).using(function (each) {
            return each.toLowerCase().split('');
        });
        return q.base$reduce(sets).using(function (a, b) {
            return q.base$filter(b).using(function (letter) {
                return (a.indexOf(letter) !== (-1));
            });
        });
    };

 // Invocations

    q.puts(sieve(["January", "February", "March", "April", "May"]));

});

//- vim:set syntax=javascript:
