//- JavaScript source code

//- lib-tester.js ~~
//
//  This program demonstrates Chassis's ability to resolve dependencies at
//  runtime without preprocessing. This example is relatively pathological,
//  and it has already helped me find several errors in Chassis itself :-)
//
//                                                      ~~ (c) SRW, 03 Aug 2011

chassis(function (q) {
    "use strict";

    q.lib("lili");

    if (q.flags.debug) {
        q.puts("--> found lili");
    }

    q.puts(q.lili$message());

    if (q.flags.debug) {
        q.puts("DONE.");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("lala");
    q.lib("lele");

    if (q.flags.debug) {
        q.puts("--> found lala, lele");
    }

 // Module definition

    q.lili = function () {

        q.lili$message = function () {
            return q.lala$message() + q.lele$message() + ":lili:";
        };

        if (q.flags.debug) {
            q.puts("--> loaded lili");
        }

    };

    if (q.flags.debug) {
        q.puts("--> defined lili");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("lele");

    if (q.flags.debug) {
        q.puts("--> found lele");
    }

 // Module definition

    q.lala = function () {

        q.lala$message = function () {
            return ":lala:";
        };

        if (q.flags.debug) {
            q.puts("--> loaded lala");
            q.puts(q.lala$message());
            q.puts(q.lele$message());
        }

    };

    if (q.flags.debug) {
        q.puts("--> defined lala");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites (n/a)

 // Module definition

    q.lele = function () {

        q.lele$message = function () {
            return ":lele:";
        };

        if (q.flags.debug) {
            q.puts("--> loaded lele");
            q.puts(q.lele$message());
        }

    };

    if (q.flags.debug) {
        q.puts("--> defined lele");
    }

});

//- vim:set syntax=javascript:
