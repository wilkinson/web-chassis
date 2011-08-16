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

    q.lib("lili") || q.die("--> awaiting lili");

    if (q.flags.debug === true) {
        q.puts("--> found lili");
    }

    q.puts(q.lili$message());

    if (q.flags.debug === true) {
        q.puts("DONE.");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();
    q.lib("lala") || q.die();
    q.lib("lele") || q.die();

    if (q.flags.debug === true) {
        q.puts("--> found base, lala, lele");
    }

 // Module definition

    q.lili = function () {

        q.lili$message = function () {
            return q.lala$message() + q.lele$message() + "lili";
        };

        if (q.flags.debug === true) {
            q.puts("--> loaded lili");
        }

    };

    if (q.flags.debug === true) {
        q.puts("--> defined lili");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die();
    q.lib("lele") || q.die();

    if (q.flags.debug === true) {
        q.puts("--> found base, lele");
    }

 // Module definition

    q.lala = function () {

        q.lala$message = function () {
            return "lala";
        };

        if (q.flags.debug === true) {
            q.puts("--> loaded lala");
            q.puts(q.lala$message());
            q.puts(q.lele$message());
        }

    };

    if (q.flags.debug === true) {
        q.puts("--> defined lala");
    }

});

chassis(function (q) {
    "use strict";

 // Prerequisites

    q.lib("base") || q.die("--> awaiting base");

    if (q.flags.debug === true) {
        q.puts("--> found base");
    }

 // Module definition

    q.lele = function () {

        q.lele$message = function () {
            return "lele";
        };

        if (q.flags.debug === true) {
            q.puts("--> loaded lele");
            q.puts(q.lele$message());
        }

    };

    if (q.flags.debug === true) {
        q.puts("--> defined lele");
    }

});

//- vim:set syntax=javascript:
