//- JavaScript source code

//- solve.js ~~
//
//  This module contains a simple nonlinear equation solver that uses the
//  Bisection Method, but eventually I may add some others. This is just for
//  fun right now, as an experiment to test the abilities of Chassis itself.
//
//                                                      ~~ (c) SRW, 18 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Module definition

    q.solve = function () {

        q.solve$bisect = function (obj) {
            var a, b, f, tol, abs, fa, fb, fmid, mid, n;
            a = obj.a;
            b = obj.b;
            f = obj.f;
            tol = obj.tol || 1e-6;
            if (a === b) {
                throw new Error("The left and right endpoints are the same.");
            }
            if (typeof f !== 'function') {
                throw new Error("The objective function must be a function.");
            }
            abs = Math.abs;
            fa = f(a);
            fb = f(b);
            n = 0;
            while ((abs(a - b) < tol) === false) {
                mid = (a + b) / 2;
                fmid = f(mid);
                if (fa * fmid < 0) {
                    b = mid;
                    fb = fmid;
                } else {
                    a = mid;
                    fa = fmid;
                }
                n += 1;
            }
            return {
                err:    abs(a - b),
                root:   mid,
                step:   n
            };
        };

    };

});

//- vim:set syntax=javascript:
