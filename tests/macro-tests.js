//- JavaScript source code

//- macro-tests.js ~~
//                                                      ~~ (c) SRW, 17 Aug 2011

chassis(function (q) {
    "use strict";

    q.lib("base")   ||  q.die();
    q.lib("macro")  ||  q.die();
    q.lib("test")   ||  q.die();

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
