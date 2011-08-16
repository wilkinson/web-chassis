//- JavaScript source code

//- blastoff.js ~~
//                                                      ~~ (c) SRW, 09 Aug 2011

chassis(function (q) {
    "use strict";

    q.lib("base") || q.die();

    var countdown;

    countdown = function (n) {
        return (n <= 0) ? "Blastoff!" : n + " ... " + countdown(n - 1);
    };

    q.puts(countdown(10));

});

//- vim:set syntax=javascript:
