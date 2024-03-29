//- JavaScript source code

//- macro-tests.js ~~
//                                                      ~~ (c) SRW, 17 Aug 2011

/*jslint indent: 4, maxlen: 80, es5: true, white: true */
/*global chassis: true */

chassis(function (q) {
    "use strict";

    q.lib("base");
    q.lib("macro");
    q.lib("test");

    q.test$run("macro", [
        {
            args:   ["\
                        Hello\
                        world!\
                    "],
            answer: ["Hello", "world!"].join("\n"),
            func:   q.macro$heredoc,
            name:   "heredoc: multiline input with non-zero indent"
        }
    ]);

});

//- vim:set syntax=javascript:
