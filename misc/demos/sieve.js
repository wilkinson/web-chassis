//- JavaScript source code

//- sieve.js ~~
//
//  This program implements the Sieve of Eratosthenes to print prime numbers.
//
//                                                      ~~ (c) SRW, 26 Aug 2011

/*jslint indent: 4, maxlen: 80 */
/*global chassis: true */

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Declarations

    var sieve;

 // Definitions

    sieve = function (n) {
        var i, j, x, y;
        x = [];
        y = [];
        for (i = 2; i < n; i += 1) {
            while (x[i]) {
                i += 1;
            }
            if (i < n) {
                y.push(i);
            }
            for (j = i * i; j < n; j += i) {
                x[j] = true;
            }
        }
        return y;
    };

 // Demonstrations

    q.puts(sieve(100).join(" "));

});

//- vim:set syntax=javascript:
