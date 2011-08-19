//- JavaScript source code

//- solve-tests.js ~~
//                                                      ~~ (c) SRW, 07 Aug 2011

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base");
    q.lib("solve");
    q.lib("test");

 // Declarations

    var bisectionTest;

 // Definitions

    bisectionTest = function () {
        var answers, f, results;
        answers = {
            err:    9.5367431640625e-7,
            root:   1.3247175216674805,
            step:   20
        };
        f = function (x) {
            return (x * x * x) - x - 1;
        };
        results = q.solve$bisect({
            a:      1,
            b:      2,
            tol:    1e-6,
            f:      f
        });
        if (answers.err === results.err) {
            if (answers.root === results.root) {
                if (answers.step === results.step) {
                    return true;
                }
            }
        }
        return false;
    };

 // Invocations

    q.test$run("solve", [
        {
            args:   [],
            answer: "true",
            func:   bisectionTest,
            name:   "bisect: runs bisection method against a known cubic"
        }
    ]);

});

//- vim:set syntax=javascript:
