//- JavaScript source code

//- stat.js ~~
//
//  This module defines functions specifically geared towards statistical
//  computing. At the moment, I'm not sure if I should include these methods
//  directly into the "math" module, but the planned quantities alone suggest
//  that I should set a precedent now rather than later :-)
//
//                                                      ~~ (c) SRW, 17 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");

 // Module definition

    q.stat = function () {

        q.stat$pnorm = q.base$generic();

        q.stat$pnorm(Number).def = function (x) {
         // This is a port into JS of an algorithm to compute a normal cdf.
         // I found it on Wikipedia (@"Bc_programming_language"), and the
         // source cited is the Journal of Statistical Software, July 2004,
         // Volume 11, Issue 5, in an article by George Marsaglia. I still
         // need to verify the reference for correctness and citation.
            var s, t, b, q, i;
            s = x;
            t = 0;
            b = x;
            q = x * x;
            i = 1;
            while (s !== t) {
                s = (t = s) + (b *= q / (i += 2));
            }
            return 0.5 + s * Math.exp(-0.5 * q - 0.91893853320467274178);
        };

        q.stat$pnorm(Array).def = function (x) {
            return q.base$map(x).using(q.stat$pnorm);
        };

    };

});

//- vim:set syntax=javascript:
